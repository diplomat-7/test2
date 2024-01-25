import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Wallet } from './wallets.model';

import { IWallet, TWalletChargeData } from './wallets.interface';

import { BalanceService } from 'src/balance/balance.service';
import { CommonsService } from 'src/commons/commons.service';

@Injectable()
export class WalletsService {
  constructor(
    @InjectModel(Wallet)
    private readonly walletRepository: typeof Wallet,
    private commonsService: CommonsService,
    private balanceService: BalanceService,
  ) {}

  async create(data: IWallet): Promise<Wallet> {
    data.framer_id = this.commonsService.generateFramerId('W');
    return this.walletRepository.create<Wallet>({ ...data });
  }

  async update(data: IWallet, walletId: number): Promise<void> {
    await this.walletRepository.update(
      { ...data },
      { where: { id: walletId } },
    );
  }

  async load(walletId: number): Promise<Wallet> {
    return this.walletRepository.findByPk(walletId);
  }

  async delete(walletId: number): Promise<void> {
    await this.walletRepository.destroy<Wallet>({ where: { id: walletId } });
  }

  async credit(data: TWalletChargeData): Promise<void> {
    const { amount, wallet, transaction } = data;
    const allocatedAmount = Number(wallet.allocated_amount);

    const balance = await this.balanceService.find({ id: wallet.balance_id });
    await this.balanceService.chargeDebit({ amount, balance, transaction });

    await this.walletRepository.update(
      { allocated_amount: allocatedAmount + amount },
      { where: { id: wallet.id }, transaction },
    );
  }

  async debit(data: TWalletChargeData): Promise<void> {
    const { amount, wallet, transaction } = data;
    const allocatedAmount = Number(wallet.allocated_amount);

    if (allocatedAmount - amount < 0) {
      throw new BadRequestException('Insufficient amount for transfer');
    }

    await this.walletRepository.update(
      { allocated_amount: allocatedAmount - amount },
      { where: { id: wallet.id }, transaction },
    );

    const balance = await this.balanceService.find({ id: wallet.balance_id });
    await this.balanceService.chargeCredit({ amount, balance, transaction });
  }
}
