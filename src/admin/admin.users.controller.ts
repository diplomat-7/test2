import {
  Get,
  Put,
  Body,
  Query,
  Patch,
  Request,
  UseGuards,
  Controller,
  BadRequestException,
} from '@nestjs/common';
import { Op, WhereOptions, FindAndCountOptions } from 'sequelize';

import { UserListDTO } from 'src/user/user.dto';
import { AdminAcceptUserDocumentDTO } from 'src/document/document.dto';

import { UserGuard } from 'src/user/user.guard';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { UserTypeGuard } from 'src/commons/guards/user_type.guard';

import {
  DOCUMENT_TYPES,
  DOCUMENT_STATUS,
} from 'src/document/document.constants';
import { USER_ATTRIBUTES, USER_TYPE } from 'src/user/user.constants';
import { COMPANY_ATTRIBUTES } from 'src/company/company.constants';

import { UserType } from 'src/commons/commons.decorator';

import { IRequest } from 'src/commons/interface/interface';
import { ICompany } from 'src/company/company.interface';

import { UserService } from 'src/user/user.service';
import { CompanyService } from 'src/company/company.service';
import { DocumentService } from 'src/document/document.service';

import { User } from 'src/user/user.model';
import { Company } from 'src/company/company.model';

@Controller('admin/users')
@UserType(USER_TYPE.ADMINS)
@UseGuards(AuthGuard, UserTypeGuard)
export class AdminUsersController {
  constructor(
    private readonly userService: UserService,
    private readonly companyService: CompanyService,
    private readonly documentService: DocumentService,
  ) {}

  @Get('/:id')
  @UseGuards(UserGuard)
  async get(@Request() req: IRequest) {
    const company = await this.companyService.findById(req.companyProfile.id);
    return { data: company };
  }

  @Get()
  async list(@Query() query: UserListDTO) {
    let where: WhereOptions<User> = {};

    if (query.status) where.email = query.status;

    if (query.search_query) {
      const searchQueryObject = {
        [Op.iLike]: `%${query.search_query}%`,
      };

      where = {
        ...where,
        [Op.or]: [
          { email: searchQueryObject },
          { phone: searchQueryObject },
          { full_name: searchQueryObject },
          { '$company.company_name$': searchQueryObject },
          { '$company.company_legal_name$': searchQueryObject },
        ],
      };
    }

    const options: FindAndCountOptions = {
      where,
      attributes: USER_ATTRIBUTES,
      include: [
        {
          model: Company,
          attributes: COMPANY_ATTRIBUTES,
          required: query.search_query != null,
        },
      ],
      limit: query.limit,
      offset: query.limit * query.offset,
    };

    const data = await this.userService.search(options);
    return { data: { users: data.rows, count: data.count } };
  }

  @Put('/:id/accept_documents')
  @UserType(USER_TYPE.A1)
  @UseGuards(UserGuard, UserTypeGuard)
  async acceptDocuments(
    @Request() req: IRequest,
    @Body() data: AdminAcceptUserDocumentDTO,
  ) {
    const companyUpdate: ICompany = {};

    const document = await this.documentService.findOne({
      id: data.documentId,
      user_id: req.profile.id,
    });

    if (!document) {
      throw new BadRequestException('Failed to load document');
    }

    if (document.status === data.status) {
      throw new BadRequestException(
        `Document has already been ${data.status.toLowerCase()}`,
      );
    }

    if (document.type === DOCUMENT_TYPES.AUTHLETTER) {
      companyUpdate.auth_letter_accepted =
        data.status === DOCUMENT_STATUS.APPROVED;
    } else if (document.type === DOCUMENT_TYPES.VATCERT) {
      companyUpdate.vat_cert_accepted =
        data.status === DOCUMENT_STATUS.APPROVED;
    }

    await this.companyService.update(companyUpdate, req.companyProfile.id);
    await this.documentService.update({ status: data.status }, document.id);

    return {
      message: `${document.type} has been ${data.status.toLowerCase()}`,
    };
  }

  @Patch('/:id/update_kyc_verifier')
  @UserType(USER_TYPE.A1)
  @UseGuards(UserGuard, UserTypeGuard)
  async updateKycVerifier(@Request() req: IRequest) {
    const user = req.profile;
    const company = req.companyProfile;

    if (!user.full_name) {
      throw new BadRequestException('User has not updated full name');
    }

    if (!user.id_number) {
      throw new BadRequestException('User has not updated id number');
    }

    if (company.kyc_verifier) {
      throw new BadRequestException('Company already has a verifier');
    }

    await this.companyService.update(
      {
        kyc_verifier: {
          name: user.full_name,
          birthDate: user.date_of_birth,
          identity: { id: user.id_number, type: 'nid' },
        },
      },
      company.id,
    );

    return { message: 'KYC verifier updated successfully' };
  }
}
