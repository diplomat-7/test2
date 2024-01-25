import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';

import { IRequest } from 'src/commons/interface/interface';
import { CompanyService } from './company.service';

@Injectable()
export class CompanyGuard implements CanActivate {
  constructor(private readonly companyService: CompanyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: IRequest = context.switchToHttp().getRequest();

    const companyId = Number(request.params.id);
    if (!companyId) throw new NotFoundException('company id is required');

    const company = await this.companyService.load(companyId);
    if (!company) {
      throw new NotFoundException(`Failed to load company id ${companyId}`);
    }

    request['company'] = company;

    return true;
  }
}
