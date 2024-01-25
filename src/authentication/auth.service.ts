import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { compare } from 'bcrypt';

import { AdminLoginDTO, LoginDTO, VerifyOtpDTO } from './auth.dto';
import { IUser } from 'src/user/user.interface';
import { IAppConfig } from 'src/commons/interface/interface';
import {
  EMAIL_SMS_TYPE,
  EMAIL_TEMPLATES,
} from 'src/email_sms_managements/email_sms_management.constants';

import { UserService } from 'src/user/user.service';
import { CommonsService } from 'src/commons/commons.service';
import { CompanyService } from 'src/company/company.service';
import { EmailAndSmsManagementService } from 'src/email_sms_managements/email_sms_management.service';
import { TwoFactorAuthenticationService } from 'src/two_factor_authentication/two_factor_authentication.services';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly commonsService: CommonsService,
    private readonly companyService: CompanyService,
    private readonly twoFAuthService: TwoFactorAuthenticationService,
    private readonly emailSmsService: EmailAndSmsManagementService,
  ) {}

  async login(data: LoginDTO): Promise<any> {
    let user = await this.userService.find({ phone: data.phone });
    if (!user) {
      const company = await this.companyService.create();
      user = await this.userService.create({
        phone: data.phone,
        company_id: company.id,
      });
    }

    const otpSecret = this.twoFAuthService.generateOtpSecret();
    const otp = this.twoFAuthService.generateOtp(otpSecret);

    // create sms record to be picked by the CRON job
    await this.emailSmsService.create({
      receiver: user.phone,
      type: EMAIL_SMS_TYPE.SMS,
      body: 'Verify your phone number using this otp ' + otp,
    });

    const { admin } = this.configService.get<IAppConfig>('config');

    if (user.email) {
      // create an email record to be picked by the CRON job
      await this.emailSmsService.create({
        sender: admin.email,
        receiver: user.email,
        body: JSON.stringify({ otp }),
        template: EMAIL_TEMPLATES.SEND_OTP,
        subject: 'Verify your Framer phone number using this otp',
      });
    }

    await this.userService.update(
      {
        otp,
        phone_verified: false,
        otp_sent_at: new Date(),
        otp_secret_key: otpSecret,
      },
      user.id,
    );

    return { message: 'Operation successful' };
  }

  async verifyPhone(data: VerifyOtpDTO): Promise<any> {
    const user = await this.userService.find({ phone: data.phone });
    if (!user) throw new UnauthorizedException('Invalid login details');

    const otpIsValid = this.twoFAuthService.validateOtp(user, data.otp);
    if (!otpIsValid) {
      throw new UnauthorizedException(
        'Invalid or expired otp, please generate a new one',
      );
    }

    await this.userService.update(
      {
        otp: null,
        otp_sent_at: null,
        phone_verified: true,
      },
      user.id,
    );

    const token = await this.jwtService.signAsync({
      userId: user.id,
      admin: false,
    });

    return {
      data: {
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          user_type: user.user_type,
          kyc_completed: user.kyc_completed,
        },
        accessToken: token,
      },
    };
  }

  async resendOtp(phone: string): Promise<any> {
    const user = await this.userService.find({ phone });
    if (!user) throw new UnauthorizedException('Invalid login details');

    const otpSecret = this.twoFAuthService.generateOtpSecret();
    const otp = this.twoFAuthService.generateOtp(otpSecret);

    const appConfig = this.configService.get<IAppConfig>('config');

    // create sms record to be picked by the CRON job
    await this.emailSmsService.create({
      receiver: phone,
      type: EMAIL_SMS_TYPE.SMS,
      body: 'Verify your Framer phone number using this otp ' + otp,
    });

    if (user.email) {
      await this.emailSmsService.create({
        receiver: user.email,
        body: JSON.stringify({ otp }),
        sender: appConfig.admin.email,
        template: EMAIL_TEMPLATES.SEND_OTP,
        subject: 'Verify your phone number using this otp',
      });
    }

    await this.userService.update(
      { otp, otp_sent_at: new Date(), phone_verified: false },
      user.id,
    );

    return { message: 'Otp has been sent' };
  }

  async sendEmailVerificationCode(user: IUser, email: string) {
    const code = this.commonsService.generateRandomNumber();

    const { admin } = this.configService.get<IAppConfig>('config');

    await this.emailSmsService.create({
      receiver: email,
      sender: admin.email,
      body: JSON.stringify({ code }),
      template: EMAIL_TEMPLATES.EMAIL_VERIFICATION,
      subject: 'Verify your email address رمز التحقق من بريدك الإلكتروني',
    });

    await this.userService.update(
      {
        email,
        email_verified: false,
        kyc_step_one_completed: false,
        email_verification_code: code.toString(),
      },
      user.id,
    );

    return { message: 'Email verification code sent successfully' };
  }

  async adminLogin(data: AdminLoginDTO): Promise<any> {
    const admin = await this.userService.find({ email: data.email });
    if (!admin) throw new UnauthorizedException('Invalid login details');

    const passwordIsValid = await compare(data.password, admin.hashed_password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid login details');
    }

    const token = await this.jwtService.signAsync({
      userId: admin.id,
      admin: true,
    });

    return {
      data: {
        user: {
          id: admin.id,
          full_name: admin.full_name,
          user_type: admin.user_type,
        },
        accessToken: token,
      },
    };
  }
}
