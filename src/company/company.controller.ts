import { Get, Request, UseGuards, Controller } from '@nestjs/common';

import { AuthGuard } from 'src/commons/guards/auth.guard';
import { KycCompletedGuard } from 'src/user/user.guard';

import { IRequest } from 'src/commons/interface/interface';

import { CompanyService } from './company.service';

@Controller('companies')
@UseGuards(AuthGuard, KycCompletedGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('/profile')
  async get(@Request() req: IRequest) {
    const company = await this.companyService.findById(req.company.id);
    return { data: company };
  }
}
