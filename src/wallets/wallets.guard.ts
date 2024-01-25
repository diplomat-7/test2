import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';

import { WalletsService } from './wallets.service';

@Injectable()
export class WalletGuard implements CanActivate {
  constructor(private walletService: WalletsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const id = Number(request.params.id);

    if (!id) throw new NotFoundException('wallet id is required');

    const wallet = await this.walletService.load(id);

    if (!wallet) throw new NotFoundException(`Failed to load wallet id ${id}`);

    request['wallet'] = wallet;

    return true;
  }
}
