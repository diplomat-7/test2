import { Module } from '@nestjs/common';
import { VibanService } from './viban.service';
import { SequelizeModule } from '@nestjs/sequelize';

import { Viban } from './viban.model';

@Module({
  exports: [VibanService],
  providers: [VibanService],
  imports: [SequelizeModule.forFeature([Viban])],
})
export class VibanModule {}
