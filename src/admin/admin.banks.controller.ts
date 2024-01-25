import {
  Body,
  Patch,
  Request,
  UseGuards,
  Controller,
  BadRequestException,
} from '@nestjs/common';

import { BankGuard } from 'src/banks/banks.guard';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { UserTypeGuard } from 'src/commons/guards/user_type.guard';

import { USER_TYPE } from 'src/user/user.constants';
import { ApproveBankDTO } from 'src/banks/banks.dto';
import { UserType } from 'src/commons/commons.decorator';
import { IRequest } from 'src/commons/interface/interface';

import { BanksService } from '../banks/banks.service';
import { DocumentService } from 'src/document/document.service';

@Controller('admin/banks')
@UserType(USER_TYPE.A1)
@UseGuards(AuthGuard, UserTypeGuard)
export class AdminBanksController {
  constructor(
    private bankService: BanksService,
    private documentService: DocumentService,
  ) {}

  @Patch('/:id/approve')
  @UseGuards(BankGuard)
  async approve(@Request() req: IRequest, @Body() data: ApproveBankDTO) {
    const document = await this.documentService.findOne({
      bank_id: req.bank.id,
    });
    if (!document) {
      throw new BadRequestException('Unable to approve bank document');
    }

    await this.bankService.update({ status: data.status }, req.bank.id);
    await this.documentService.update({ status: data.status }, document.id);
    return { message: 'Bank status updated successfully' };
  }
}
