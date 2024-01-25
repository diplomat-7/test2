import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { IRequest } from '../interface/interface';
import { userTypeKey } from '../commons.decorator';
import { USER_TYPE } from 'src/user/user.constants';

@Injectable()
export class UserTypeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.getAllAndOverride<string>(userTypeKey, [
      context.getHandler(),
      context.getClass(),
    ]);

    const permissionError = 'You do not have the permission to view this route';

    if (!role) throw new UnauthorizedException(permissionError);

    const request: IRequest = context.switchToHttp().getRequest();
    const user = request.user;

    if (
      role === USER_TYPE.ADMINS &&
      !['A1', 'A2', 'A3'].includes(user.user_type)
    ) {
      throw new UnauthorizedException(permissionError);
    } else if (role !== USER_TYPE.ADMINS && role !== user.user_type) {
      throw new UnauthorizedException(permissionError);
    }

    return true;
  }
}
