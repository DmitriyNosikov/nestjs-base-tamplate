import { applyDecorators, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserAccessTokenRDO } from '../rdo/create-user-access-token.rdo';

export function ApiUserRefreshToken(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth('JWT-REFRESH'),
    ApiResponse({
      status: 200,
      description: 'Обновление токена доступа пользователя',
      type: CreateUserAccessTokenRDO
    }),
    ApiResponse({
      status: 401,
      description: 'Некорректный токен доступа пользователя',
      type: UnauthorizedException
    })
  )
}