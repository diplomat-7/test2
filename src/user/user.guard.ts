import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

import { UserService } from './user.service';
import { IRequest } from 'src/commons/interface/interface';

@Injectable()
export class KycCompletedGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: IRequest = context.switchToHttp().getRequest();

    if (!request.user.kyc_completed) {
      throw new UnauthorizedException('Please complete your KYC to proceed');
    }

    return true;
  }
}

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const userId = Number(request.params.id);

    if (!userId) throw new BadRequestException('user id is required');

    const user = await this.userService.load(userId);
    if (!user) {
      throw new BadRequestException(`Failed to load user id ${userId}`);
    }

    request['profile'] = user;
    request['companyProfile'] = user.company;

    return true;
  }
}
