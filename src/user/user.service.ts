import {
  Inject,
  Injectable,
  forwardRef,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindAndCountOptions } from 'sequelize';

import { User } from './user.model';
import { Balance } from 'src/balance/balance.model';
import { Company } from 'src/company/company.model';
import { Document } from 'src/document/document.model';

import { UpdateUserDTO } from './user.dto';
import { IUser, TUserKeys, TUpdateUserData } from './user.interface';

import { CommonsService } from 'src/commons/commons.service';
import { CompanyService } from 'src/company/company.service';
import { TCompanyKeys } from 'src/company/company.constants';

interface ICountWithOptions {
  rows: User[];
  count: number;
}
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userReposity: typeof User,
    private commonsService: CommonsService,

    // to avoid circular dependency
    @Inject(forwardRef(() => CompanyService))
    private companyService: CompanyService,
  ) {}

  async create(data: IUser): Promise<User> {
    data.framer_id = this.commonsService.generateFramerId('SC');
    return this.userReposity.create<User>({ ...data });
  }

  async findById(id: number): Promise<User> {
    return this.userReposity.findByPk<User>(id, {
      include: [
        { model: Company, include: [{ model: Balance }, { model: Document }] },
      ],
    });
  }

  async load(id: number): Promise<User> {
    return this.userReposity.findByPk<User>(id, {
      include: [
        {
          model: Company,
          required: true,
          include: [{ model: Balance, required: true }],
        },
      ],
    });
  }

  async loadAdmin(id: number): Promise<User> {
    return this.userReposity.findByPk<User>(id);
  }

  async find(data: IUser): Promise<User> {
    return this.userReposity.findOne<User>({
      where: { ...data },
      include: [{ model: Company, include: [{ model: Balance }] }],
    });
  }

  async search(options: FindAndCountOptions): Promise<ICountWithOptions> {
    return this.userReposity.findAndCountAll<User>(options);
  }

  async update(data: IUser, userId: number): Promise<void> {
    await this.userReposity.update<User>(data, {
      where: { id: userId },
    });
  }

  async updatesKycCompletedSteps(user: IUser): Promise<void> {
    const updatedUser = await this.userReposity.findOne({
      where: { id: user.id },
      include: [Company],
    });
    const company = updatedUser.company;

    const stepOneCompleted =
      updatedUser.email != null &&
      updatedUser.email_verified &&
      updatedUser.full_name != null &&
      updatedUser.id_number != null &&
      updatedUser.date_of_birth != null;

    const stepTwoCompleted =
      company?.cr_number != null &&
      company?.company_name != null &&
      company?.cr_creation_date != null;

    const updateData: Record<string, any> = {
      kyc_step_one_completed: stepOneCompleted,
      kyc_step_two_completed: stepTwoCompleted,
    };

    if (!updatedUser.kyc_completed) {
      const kycCompleted =
        stepOneCompleted &&
        stepTwoCompleted &&
        company?.kyc_verified &&
        company?.vat_number != null;

      updateData.kyc_completed = kycCompleted;
    }

    await this.update(updateData, user.id);
    await this.companyService.updatesBalanceIban(user);
  }

  async verifyEmail(data: UpdateUserDTO, user: IUser): Promise<any> {
    const { email_verified, email: userEmail } = user;
    const { email: newEmail, email_otp } = data;

    if (email_verified && userEmail == newEmail) return;

    if (!email_otp) {
      throw new BadRequestException('Email verification code is required');
    }

    if (userEmail != newEmail) {
      throw new BadRequestException('Invalid email address');
    }

    if (email_otp.trim() != user.email_verification_code) {
      throw new BadRequestException('Invalid email verification code');
    }

    if (!email_verified) {
      await this.update(
        {
          email_verified: true,
          email_verification_code: null,
        },
        user.id,
      );
    }
  }

  async getUpdateValue(
    formData: UpdateUserDTO,
    user: IUser,
  ): Promise<TUpdateUserData> {
    const validUpdateData: TUpdateUserData = {};

    const userUpdateKeys: TUserKeys[] = ['full_name', 'date_of_birth'];
    const companyUpdateKeys: TCompanyKeys[] = [
      'cr_number',
      'vat_number',
      'company_name',
      'cr_creation_date',
    ];

    validUpdateData.user = {};
    validUpdateData.company = {};

    for (let key of userUpdateKeys) {
      if (formData[key] && formData[key] !== user[key]) {
        validUpdateData.user[key] = formData[key];
      }
    }

    for (let key of companyUpdateKeys) {
      if (formData[key] && formData[key] !== user.company[key]) {
        validUpdateData.company[key] = formData[key];
      }
    }

    if (!formData.cr_number) return validUpdateData;

    let crCreationDate = user.company.cr_creation_date;

    if (validUpdateData.company?.cr_number) {
      const { cr_creation_date } = await this.companyService.initiateKyc(
        user,
        validUpdateData.company.cr_number,
      );

      crCreationDate = cr_creation_date;
    }

    if (crCreationDate !== formData.cr_creation_date) {
      throw new BadRequestException(
        "The creation date doesn't match the CR Number",
      );
    }

    return validUpdateData;
  }
}
