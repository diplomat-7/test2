import { SetMetadata } from '@nestjs/common';
import { USER_TYPE } from 'src/user/user.constants';

export const userTypeKey = 'userType';
export const UserType = (userType: USER_TYPE) => {
  return SetMetadata(userTypeKey, userType);
};

export const Roles = (...roles: []) => {
  return SetMetadata('roles', roles);
};
