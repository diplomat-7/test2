import {
  Put,
  Post,
  Body,
  Request,
  UseGuards,
  Controller,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDTO,
  VerifyOtpDTO,
  VerifyEmailDTO,
  AdminLoginDTO,
} from './auth.dto';
import { IRequest } from 'src/commons/interface/interface';
import { AuthGuard } from 'src/commons/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() data: LoginDTO) {
    return await this.authService.login(data);
  }

  @Post('/admin/login')
  async adminLogin(@Body() data: AdminLoginDTO) {
    return await this.authService.adminLogin(data);
  }

  @Put('/verify_phone')
  async verifyPhone(@Body() data: VerifyOtpDTO) {
    return await this.authService.verifyPhone(data);
  }

  @Post('/resend_otp')
  async resendOtp(@Body() data: LoginDTO) {
    return await this.authService.resendOtp(data.phone);
  }

  @Post('/send_email_verification_code')
  @UseGuards(AuthGuard)
  async sendEmailCode(@Request() req: IRequest, @Body() data: VerifyEmailDTO) {
    return await this.authService.sendEmailVerificationCode(
      req.user,
      data.email,
    );
  }
}
