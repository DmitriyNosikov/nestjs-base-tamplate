import { applyDecorators, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';
import { ApiParam } from '@nestjs/swagger';
import { CreateUserRDO } from '../rdo/create-user.rdo';

export function ApiGetUser(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth('JWT-ACCESS'),
    ApiParam({
      name: 'userId',
      description: 'ID пользователя',
      type: Number,
      example: 1
    }),
    ApiResponse({
      status: 200,
      description: 'Получение пользователя по id',
      type: CreateUserRDO
    }),
    ApiResponse({
      status: 401,
      description: 'Некорректный токен доступа пользователя',
      type: UnauthorizedException
    }),
    ApiUnauthorizedResponse({ description: 'Некорректный токен доступа пользователя' }),
  );
}