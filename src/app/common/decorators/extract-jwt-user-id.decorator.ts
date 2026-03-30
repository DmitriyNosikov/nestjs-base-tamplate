import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserTokenPayloadType } from '../types';

export const ExtractJWTUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserTokenPayloadType = request?.user;

    return user.userId;
  }
);