import { applyDecorators, UnauthorizedException } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, IntersectionType } from '@nestjs/swagger';
import { CreateUserDTO } from '../dto/create-user.dto';
import { CreateUserAccessTokenRDO } from '../rdo/create-user-access-token.rdo';
import { CreateUserRDO } from '../rdo/create-user.rdo';

export function ApiCreateUser(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBody({
      type: CreateUserDTO
    }),
    ApiResponse({
      status: 200,
      description: 'Пользователь успешно создан',
      type: () => IntersectionType(CreateUserAccessTokenRDO, CreateUserRDO)
    }),
  );
}