import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UnauthorizedException } from '@nestjs/common';

export function ApiDeleteUser(summary: string) {
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
      description: 'Пользователь успешно удален',
      type: null
    }),
    ApiResponse({
      status: 401,
      description: 'Некорректный токен доступа пользователя',
      type: UnauthorizedException
    }),
    ApiUnauthorizedResponse({ description: 'Некорректный токен доступа пользователя' }),
  );
}