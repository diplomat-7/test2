import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Viban } from './viban.model';
import { IViban, IVibanId } from './viban.interface';

@Injectable()
export class VibanService {
  constructor(
    @InjectModel(Viban)
    private readonly vibanRepository: typeof Viban,
  ) {}

  async find(data: IViban): Promise<Viban> {
    return this.vibanRepository.findOne<Viban>({
      where: { ...data },
    });
  }

  async update(data: IViban, viban: IVibanId): Promise<void> {
    await this.vibanRepository.update(data, {
      where: { id: viban.id },
    });
  }
}
