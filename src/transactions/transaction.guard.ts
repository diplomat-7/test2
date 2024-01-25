import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';

import { TransactionsService } from './transactions.service';

@Injectable()
export class TransactionGuard implements CanActivate {
  constructor(private transactionService: TransactionsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const id = Number(request.params.id);

    if (!id) throw new NotFoundException('transaction id is required');

    const transaction = await this.transactionService.load(id);

    if (!transaction)
      throw new NotFoundException(`Failed to load transaction id ${id}`);

    request['transaction'] = transaction;

    return true;
  }
}
