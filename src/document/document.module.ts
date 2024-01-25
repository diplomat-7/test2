import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { User } from 'src/user/user.model';
import { Document } from './document.model';

import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';

import { CommonsModule } from 'src/commons/commons.module';

@Module({
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService],
  imports: [SequelizeModule.forFeature([Document, User]), CommonsModule],
})
export class DocumentModule {}
