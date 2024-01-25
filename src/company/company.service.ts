import {
  Inject,
  forwardRef,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { UserService } from 'src/user/user.service';
import { WathqService } from 'src/wathq/wathq.service';
import { CommonsService } from 'src/commons/commons.service';

import { Company } from './company.model';
import { User } from 'src/user/user.model';
import { Bank } from 'src/banks/banks.model';
import { Document } from 'src/document/document.model';

import {
  DOCUMENT_TYPES,
  DOCUMENT_ATTRIBUTES,
} from 'src/document/document.constants';
import { COMPANY_ATTRIBUTES } from './company.constants';
import { BANK_ATTRIBUTES } from 'src/banks/banks.constants';
import { USER_ATTRIBUTES } from 'src/user/user.constants';

import { ICompany } from './company.interface';
import { IUser } from 'src/user/user.interface';
import { IWathq } from 'src/wathq/wathq.interface';

import { VibanService } from 'src/viban/viban.service';
import { BalanceService } from 'src/balance/balance.service';
import { DocumentService } from 'src/document/document.service';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company)
    private readonly companyRepository: typeof Company,
    private commonsService: CommonsService,
    private wathqService: WathqService,
    private vibanService: VibanService,
    private balanceService: BalanceService,
    private documentService: DocumentService,

    // to avoid circular dependency
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async create(data: ICompany = {}): Promise<Company> {
    data['framer_id'] = this.commonsService.generateFramerId('C');
    const company = await this.companyRepository.create<Company>({ ...data });
    await this.balanceService.create({ company_id: company.id });
    return company;
  }

  async find(data: ICompany): Promise<Company> {
    return this.companyRepository.findOne<Company>({
      where: { ...data },
    });
  }

  async load(id: number): Promise<Company> {
    return this.companyRepository.findByPk(id);
  }

  async findById(id: number): Promise<Company> {
    return this.companyRepository.findByPk(id, {
      attributes: COMPANY_ATTRIBUTES,
      include: [
        {
          model: Bank,
          attributes: BANK_ATTRIBUTES,
          include: [{ model: Document, attributes: DOCUMENT_ATTRIBUTES }],
        },
        {
          model: User,
          attributes: USER_ATTRIBUTES,
        },
        {
          model: Document,
          attributes: DOCUMENT_ATTRIBUTES,
        },
      ],
    });
  }

  async findAll(
    data: ICompany = {},
    whereObject: any = {},
  ): Promise<Company[]> {
    return this.companyRepository.findAll<Company>({
      where: { ...data },
      ...whereObject,
    });
  }

  async update(data: ICompany, companyId: number): Promise<void> {
    await this.companyRepository.update<Company>(data, {
      where: { id: companyId },
    });
  }

  async sendOtpToVerifier(user: IUser): Promise<any> {
    if (!user.id_number) throw new BadRequestException('Invalid id number');

    const { data } = await this.wathqService.sendElm(user.id_number);
    if (data.err) throw new BadRequestException('Invalid Id number');

    await this.update({ kyc_verification_code: data.otp }, user.company.id);

    return { message: 'Otp has been sent successfully' };
  }

  async initiateKyc(user: IUser, cr: string): Promise<IWathq> {
    const crUsed = await this.checkIfCrHasBeenUsed(cr);
    if (crUsed) throw new BadRequestException('CR is already registered');

    let wathqRecord: IWathq = await this.wathqService.findByCr(cr);
    if (wathqRecord) {
      await this.updatePendingWathqInfo(user.company, wathqRecord);
      await this.updateKycVerifier(wathqRecord.data, user);
      return wathqRecord;
    }

    const data = await this.wathqService
      .getWathqInfo(cr)
      .then((res) => res.data)
      .catch(() => {
        throw new BadRequestException('Failed to initiate kyc');
      });

    wathqRecord = await this.wathqService.create({
      cr_number: cr,
      cr_city: data.location?.name,
      company_legal_name: data.crName,
      cr_creation_date: this.commonsService.convertDates({
        input: data.issueDate,
      }),
      cr_expiry_date: this.commonsService.convertDates({
        input: data.expiryDate,
      }),
    });

    await this.updatePendingWathqInfo(user.company, wathqRecord);

    if (data.company || data.businessType?.id?.charAt(0) == '2') {
      const mngData = await this.wathqService
        .getManagers(cr)
        .then((res) => res.data)
        .catch(() => {
          throw new BadRequestException('Failed to initiate kyc');
        });

      await this.wathqService.update({ data: mngData }, cr);
      await this.updateKycVerifier(mngData, user);
      return wathqRecord;
    }

    const ownsData = await this.wathqService
      .getOwners(cr)
      .then((res) => res.data)
      .catch(() => {
        throw new BadRequestException('Failed to initiate kyc');
      });

    await this.updateKycVerifier(ownsData, user);
    await this.wathqService.update({ data: ownsData }, cr);
    return wathqRecord;
  }

  async updateKycVerifier(data: Record<string, any>, user: IUser) {
    const company = user.company;
    if (company.kyc_verifier) return;

    let verifier = data.find(
      (v: Record<string, any>) => v.identity?.id == user.id_number,
    );

    if (verifier)
      await this.update(
        { kyc_verifier: verifier, auth_letter_accepted: true },
        company.id,
      );
  }

  async updatePendingWathqInfo(company: ICompany, wathq: IWathq) {
    await this.update(
      {
        cr_city: wathq.cr_city,
        cr_expiry_date: wathq.cr_expiry_date,
        company_legal_name: wathq.company_legal_name,
      },
      company.id,
    );
  }

  async checkIfCrHasBeenUsed(cr: string): Promise<boolean> {
    const company = await this.find({ cr_number: cr, kyc_verified: true });
    return company != null;
  }

  async verifyKyc(company: ICompany, otp: string): Promise<any> {
    if (company.kyc_verified) return;
    if (company.kyc_verification_code != otp) {
      throw new BadRequestException('Invalid kyc verification code');
    }
    await this.update({ kyc_verified: true }, company.id);
    await this.removesCRFromNonOwnersProfile(company.cr_number);
  }

  async removesCRFromNonOwnersProfile(cr: string): Promise<void> {
    const nonCrOnwers = await this.findAll({
      cr_number: cr,
      kyc_verified: false,
    });

    for (let company of nonCrOnwers) {
      await this.update(
        {
          cr_city: null,
          cr_number: null,
          cr_expiry_date: null,
          cr_creation_date: null,
          company_legal_name: null,
        },
        company.id,
      );
    }
  }

  async updatesBalanceIban(user: IUser) {
    const company = user.company;
    const balance = await this.balanceService.find({ company_id: company.id });
    if (balance.iban) return;

    const unusedViban = await this.vibanService.find({ used: false });
    if (!unusedViban) {
      await this.userService.update({ kyc_completed: false }, user.id);
      throw new BadRequestException(
        'Unable to complete your registration, please contact the admin',
      );
    }

    await this.balanceService.update({ iban: unusedViban.viban }, balance.id);
    await this.vibanService.update({ used: true }, { id: unusedViban.id });
  }

  async checkIdNumberVerifier(user: IUser, idNumber: string): Promise<any> {
    const company = user.company;
    if (user.id_number === idNumber) return;

    await this.userService.update({ id_number: idNumber }, user.id);

    const wathqRecord = await this.wathqService.findByCr(company.cr_number);
    if (!wathqRecord?.data) return;

    const verifier = wathqRecord.data.find(
      (v: Record<string, any>) => v.identity?.id == idNumber,
    );

    if (verifier) {
      user.id_number = idNumber;
      return await this.update(
        {
          kyc_verified: false,
          kyc_verifier: verifier,
          auth_letter_accepted: true,
        },
        company.id,
      );
    }

    await this.update(
      {
        kyc_verified: false,
        kyc_verifier: null,
        auth_letter_accepted: false,
      },
      company.id,
    );

    const authLetter = await this.documentService.findOne({
      company_id: company.id,
      type: DOCUMENT_TYPES.AUTHLETTER,
    });

    if (authLetter) await this.documentService.delete(authLetter.id);
  }
}
