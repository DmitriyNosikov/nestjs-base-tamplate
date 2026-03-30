import { PaginationResponseSwaggerRDO } from '@common/rdo/pagination-response.rdo';
import { applyDecorators, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { CreateUserRDO } from '../rdo/create-user.rdo';
import { SortDirectionTypeEnum } from '@common/types';

export function ApiIndexUsers(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiQuery({
      name: 'id',
      description: 'ID пользователя',
      type: Number,
      example: 1
    }),
    ApiQuery({
      name: 'login',
      description: 'Логин пользователя',
      type: String,
      example: 'Neo'
    }),
    ApiQuery({
      name: 'createdAt',
      description: 'Дата создания пользователя',
      type: Date,
      example: new Date()
    }),
    ApiQuery({
      name: 'sortDirection',
      description: 'Направление сортировки',
      type: String,
      enum: SortDirectionTypeEnum,
      example: 'DESC'
    }),
    ApiQuery({
      name: 'sortBy',
      description: 'Поле сортировки',
      type: String,
      example: 'createdAt'
    }),
    ApiQuery({
      name: 'returnRelations',
      description: 'Возвращать ли связанные данные',
      type: Boolean,
      example: true
    }),
    ApiQuery({
      name: 'page',
      description: 'Номер страницы',
      type: Number,
      example: 1
    }),
    ApiQuery({
      name: 'limit',
      description: 'Количество пользователей на странице',
      type: Number,
      example: 10
    }),
    ApiResponse({
      status: 200,
      description: 'Список пользователей успешно получен',
      type: PaginationResponseSwaggerRDO(CreateUserRDO)
    }),
    ApiUnauthorizedResponse({ description: 'Некорректный токен доступа пользователя' }),
  );
}