import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UserService } from 'src/user/user.service';
import { IJwtSign } from '../interface/interface';
import { User } from 'src/user/user.model';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException('Invalid token');

    try {
      const payload: IJwtSign = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('jwt_secret'),
      });

      let user: User;

      if (payload.admin) {
        user = await this.userService.loadAdmin(payload.userId);
      } else {
        user = await this.userService.load(payload.userId);
      }

      if (!user) throw new UnauthorizedException('Failed to load user');

      if (!user.phone_verified) {
        throw new UnauthorizedException('You must verify your phone');
      }

      request['user'] = user;
      request['company'] = user.company;
      request['balance'] = user.company?.balance;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
