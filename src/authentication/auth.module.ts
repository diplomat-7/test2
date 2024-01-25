import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';

import { CommonsModule } from 'src/commons/commons.module';
import { EmailAndSmsManagementModule } from 'src/email_sms_managements/email_sms_management.module';
import { TwoFactionAuthenticationModule } from 'src/two_factor_authentication/two_factor_authentication.module';
import { CompanyModule } from 'src/company/company.module';

@Module({
  imports: [
    UserModule,
    CommonsModule,
    CompanyModule,
    EmailAndSmsManagementModule,
    TwoFactionAuthenticationModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
