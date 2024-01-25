import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Balance } from './balance.model';
import { Wallet } from 'src/wallets/wallets.model';

import { IBalance, TBalanceChargeData } from './balance.interface';

@Injectable()
export class BalanceService {
  constructor(
    @InjectModel(Balance)
    private readonly balanceRepository: typeof Balance,
  ) {}

  async create(data?: IBalance): Promise<Balance> {
    return this.balanceRepository.create<Balance>({ ...data });
  }

  async update(data: IBalance, balanceId: number) {
    await this.balanceRepository.update<Balance>(data, {
      where: { id: balanceId },
    });
  }

  async find(data: IBalance): Promise<Balance> {
    return this.balanceRepository.findOne<Balance>({
      where: { ...data },
    });
  }

  async findBalanceById(balanceId: number): Promise<Balance> {
    return this.balanceRepository.findByPk(balanceId, {
      include: [Wallet],
      order: [[{ model: Wallet, as: 'wallets' }, 'id', 'desc']],
    });
  }

  async chargeCredit(data: TBalanceChargeData): Promise<void> {
    const { amount, balance, transaction } = data;
    const totalAmount = Number(balance.total_amount);
    const allocatedAmount = Number(balance.allocated_amount);

    await this.balanceRepository.update(
      {
        total_amount: totalAmount + amount,
        allocated_amount: allocatedAmount - amount,
      },
      { where: { id: balance.id }, transaction },
    );
  }

  async fund(data: TBalanceChargeData): Promise<void> {
    const { amount, balance, transaction } = data;
    const totalAmount = Number(balance.total_amount);

    await this.balanceRepository.update(
      { total_amount: totalAmount + amount },
      { where: { id: balance.id }, transaction },
    );
  }

  async withdraw(data: TBalanceChargeData): Promise<void> {
    const { amount, balance, transaction } = data;
    const totalAmount = Number(balance.total_amount);

    await this.balanceRepository.update(
      { total_amount: totalAmount - amount },
      { where: { id: balance.id }, transaction },
    );
  }

  async chargeDebit(data: TBalanceChargeData): Promise<void> {
    const { amount, balance, transaction } = data;
    const totalAmount = Number(balance.total_amount);
    const allocatedAmount = Number(balance.allocated_amount);

    if (totalAmount - amount < 0) {
      throw new BadRequestException('Insufficient amount for transfer');
    }

    await this.balanceRepository.update(
      {
        total_amount: totalAmount - amount,
        allocated_amount: allocatedAmount + amount,
      },
      { where: { id: balance.id }, transaction },
    );
  }
}
