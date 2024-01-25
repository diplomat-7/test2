import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';

import { BanksService } from './banks.service';
import { IRequest } from 'src/commons/interface/interface';

@Injectable()
export class BankGuard implements CanActivate {
  constructor(private bankService: BanksService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: IRequest = context.switchToHttp().getRequest();

    const bankId = Number(request.params.id);
    if (!bankId) throw new NotFoundException('bank id is required');

    const bank = await this.bankService.load(bankId);
    if (!bank) throw new NotFoundException(`Failed to load bank id ${bankId}`);

    request['bank'] = bank;

    return true;
  }
}
