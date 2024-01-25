import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Wathq } from './wathq.model';
import { CommonsModule } from 'src/commons/commons.module';
import { WathqService } from './wathq.service';

@Module({
  controllers: [],
  providers: [WathqService],
  exports: [WathqService],
  imports: [SequelizeModule.forFeature([Wathq]), CommonsModule],
})
export class WathqModule {}
