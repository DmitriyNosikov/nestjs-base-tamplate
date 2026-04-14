import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { CreateUserRDO } from '../rdo/create-user.rdo';

export function ApiPaginatedIndexUsers(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth('JWT-ACCESS'),
    // FIXME: Не обязательно здесь описывать все параметры,
    // если они описаны в DTO.
    // Swagger подтягивает их автоматически из DTO
    ApiResponse({
      status: 200,
      description: 'Список пользователей',
      type: [CreateUserRDO]
    }),
    ApiUnauthorizedResponse({ description: 'Некорректный токен доступа пользователя' })
  );
}