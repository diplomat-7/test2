import { Get, Put, Body, Request, UseGuards, Controller } from '@nestjs/common';

import { UpdateUserDTO } from './user.dto';
import { AuthGuard } from 'src/commons/guards/auth.guard';

import { UserService } from './user.service';
import { IRequest } from 'src/commons/interface/interface';
import { CompanyService } from 'src/company/company.service';
import { DocumentService } from 'src/document/document.service';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private companyService: CompanyService,
    private documentService: DocumentService,
  ) {}

  @Put('/update')
  @UseGuards(AuthGuard)
  async update(@Request() req: IRequest, @Body() data: UpdateUserDTO) {
    const user = req.user;
    const company = req.company;

    if (data.email) {
      await this.userService.verifyEmail(data, user);
    }

    if (data.id_number) {
      await this.companyService.checkIdNumberVerifier(user, data.id_number);
    }

    const validUpdateData = await this.userService.getUpdateValue(data, user);

    if (data.kyc_otp) {
      await this.companyService.verifyKyc(company, data.kyc_otp);
    }

    if (Object.keys(validUpdateData.user).length) {
      await this.userService.update(validUpdateData.user, user.id);
    }

    if (Object.keys(validUpdateData.company).length) {
      await this.companyService.update(validUpdateData.company, company.id);
    }

    if (data.documentId) {
      await this.documentService.tieModelToDocument({
        documentId: data.documentId,
        data: {
          user_id: user.id,
          company_id: company.id,
        },
      });
    }

    await this.userService.updatesKycCompletedSteps(user);
    return { message: 'User updated successfully' };
  }

  @Get('/profile')
  @UseGuards(AuthGuard)
  async profile(@Request() req: IRequest) {
    const user = await this.userService.findById(req.user.id);
    return { data: user };
  }

  @Put('/send_otp_kyc')
  @UseGuards(AuthGuard)
  async sendOtpToKycVerifier(@Request() req: IRequest) {
    return await this.companyService.sendOtpToVerifier(req.user);
  }
}
