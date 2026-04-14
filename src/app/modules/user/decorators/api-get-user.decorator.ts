import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';
import { CreateUserRDO } from '../rdo/create-user.rdo';

export function ApiGetUser(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth('JWT-ACCESS'),
    ApiResponse({
      status: 200,
      description: 'Получение пользователя по id',
      type: CreateUserRDO
    }),
    ApiUnauthorizedResponse({ description: 'Некорректный токен доступа пользователя' }),
  );
}