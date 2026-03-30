import { applyDecorators, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CreateUserAccessTokenRDO } from '../rdo/create-user-access-token.rdo';

export function ApiUserRefreshToken(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth('JWT-REFRESH'),
    ApiResponse({
      status: 200,
      description: 'Обновление refresh-токена доступа пользователя',
      type: CreateUserAccessTokenRDO
    }),
    ApiUnauthorizedResponse({ description: 'Некорректный refresh-токен пользователя' })
  )
}