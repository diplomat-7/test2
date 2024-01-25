import { authenticator } from 'otplib';
import { Injectable } from '@nestjs/common';
import { IUser } from 'src/user/user.interface';

authenticator.options = {
  digits: 4,
};
@Injectable()
export class TwoFactorAuthenticationService {
  constructor() {}

  generateOtpSecret(): string {
    return authenticator.generateSecret();
  }

  generateOtp(secret: string): string {
    return authenticator.generate(secret);
  }

  /* Otp is invalid if it is not used within 2 minutes of generation */
  validateOtp(user: IUser, otp: string): boolean {
    if (user.otp != otp) return false;

    const otpSentAt = new Date(user.otp_sent_at).getTime();
    const diffMilliseconds = new Date().getTime() - otpSentAt;
    const timeDiffMinutes = diffMilliseconds / 60000;

    return timeDiffMinutes < 2;
  }
}
