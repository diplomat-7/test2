import { Global, Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { User } from './user.model';
import { UserService } from './user.service';
import { UserController } from './user.controller';

import { WathqModule } from 'src/wathq/wathq.module';
import { CommonsModule } from 'src/commons/commons.module';
import { CompanyModule } from 'src/company/company.module';
import { DocumentModule } from 'src/document/document.module';

@Global()
@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports: [
    SequelizeModule.forFeature([User]),
    forwardRef(() => CompanyModule),
    DocumentModule,
    CommonsModule,
    WathqModule,
  ],
})
export class UserModule {}
