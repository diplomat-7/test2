import { Module } from '@nestjs/common';

import { TwoFactorAuthenticationService } from './two_factor_authentication.services';

@Module({
  providers: [TwoFactorAuthenticationService],
  exports: [TwoFactorAuthenticationService],
  imports: [],
})
export class TwoFactionAuthenticationModule {}
