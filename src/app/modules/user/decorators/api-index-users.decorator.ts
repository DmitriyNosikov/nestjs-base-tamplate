import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
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
    ApiUnauthorizedResponse({ description: 'Некорректный токен доступа пользователя' })
  );
}