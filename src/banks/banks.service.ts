import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction as T } from 'sequelize';

import { Bank } from './banks.model';
import { Document } from 'src/document/document.model';

import { IBank } from './banks.interface';
import { CommonsService } from 'src/commons/commons.service';

import { BANK_ATTRIBUTES, BANK_STATUS } from './banks.constants';
import { DOCUMENT_ATTRIBUTES } from 'src/document/document.constants';

@Injectable()
export class BanksService {
  constructor(
    @InjectModel(Bank)
    private readonly bankRepository: typeof Bank,
    private commonsService: CommonsService,
  ) {}

  async create(data: IBank, transaction?: T): Promise<Bank> {
    data['framer_id'] = this.commonsService.generateFramerId('B');
    return this.bankRepository.create<Bank>({ ...data }, { transaction });
  }

  async load(bankId: number): Promise<Bank> {
    return this.bankRepository.findByPk<Bank>(bankId, {
      attributes: BANK_ATTRIBUTES,
      include: [{ model: Document, attributes: DOCUMENT_ATTRIBUTES }],
    });
  }

  async update(data: IBank, bankId: number): Promise<void> {
    await this.bankRepository.update({ ...data }, { where: { id: bankId } });
  }

  async delete(bankId: number): Promise<void> {
    await this.bankRepository.destroy({ where: { id: bankId } });
  }

  async validateWithdrawalBank(bankId: number, companyId: number) {
    const bank = await this.load(bankId);
    if (!bank) throw new NotFoundException(`Failed to load bank id ${bankId}`);

    if (companyId !== bank.company_id) {
      throw new UnauthorizedException('Invalid bank owner');
    }

    if (bank.status !== BANK_STATUS.APPROVED) {
      throw new BadRequestException('Bank must be approved');
    }
  }
}
