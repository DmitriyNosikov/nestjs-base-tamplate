import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { CreateUserRDO } from '../rdo/create-user.rdo';
import { SortDirectionTypeEnum } from '@core/common/types';

export function ApiPaginatedIndexUsers(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBearerAuth('JWT-ACCESS'),
    ApiQuery({
      name: 'id',
      description: 'ID пользователя',
      type: Number,
      example: 1,
      required: false
    }),
    ApiQuery({
      name: 'login',
      description: 'Логин пользователя',
      type: String,
      example: 'Neo',
      required: false
    }),
    ApiQuery({
      name: 'createdAt',
      description: 'Дата создания пользователя',
      type: Date,
      example: new Date(),
      required: false
    }),
    ApiQuery({
      name: 'sortDirection',
      description: 'Направление сортировки',
      type: String,
      enum: SortDirectionTypeEnum,
      example: 'DESC',
      required: false
    }),
    ApiQuery({
      name: 'sortBy',
      description: 'Поле сортировки',
      type: String,
      example: 'createdAt',
      required: false
    }),
    ApiQuery({
      name: 'returnRelations',
      description: 'Возвращать ли связанные данные',
      type: Boolean,
      example: true,
      required: false
    }),
    ApiQuery({
      name: 'page',
      description: 'Номер страницы',
      type: Number,
      example: 1,
      required: false
    }),
    ApiQuery({
      name: 'limit',
      description: 'Количество пользователей на странице',
      type: Number,
      example: 10,
      required: false
    }),
    ApiResponse({
      status: 200,
      description: 'Список пользователей',
      type: [CreateUserRDO]
    }),
    ApiUnauthorizedResponse({ description: 'Некорректный токен доступа пользователя' })
  );
}