import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiUnauthorizedResponse,
  PartialType
} from '@nestjs/swagger';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UpdateUserRDO } from '../rdo/update-user.rdo';

export function ApiUpdateUser(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth('JWT-ACCESS'),
    ApiParam({
      name: 'userId',
      description: 'ID пользователя',
      type: Number,
      example: 1
    }),
    ApiBody({ type: PartialType(CreateUserDTO) }),
    ApiResponse({
      status: 200,
      description: 'Данные пользователя успешно обновлены',
      type: UpdateUserRDO
    }),
    ApiUnauthorizedResponse({ description: 'Некорректный токен доступа пользователя' }),
  );
}