import { applyDecorators, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateUserRDO } from '../rdo/create-user.rdo';

export function ApiIndexUsers(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth('JWT-ACCESS'),
    ApiResponse({
      status: 200,
      description: 'Список пользователей',
      type: [CreateUserRDO]
    }),
    ApiResponse({
      status: 401,
      description: 'Некорректный токен доступа пользователя',
      type: UnauthorizedException
    })
  );
}