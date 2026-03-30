import { applyDecorators, UnauthorizedException } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiUnauthorizedResponse, IntersectionType } from '@nestjs/swagger';
import { LoginUserDTO } from '../dto/login-user.dto';
import { CreateUserRDO } from '../rdo/create-user.rdo';
import { CreateUserAccessTokenRDO } from '../rdo/create-user-access-token.rdo';

export function ApiUserLogin(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiBody({ type: LoginUserDTO }),
    ApiResponse({
      status: 200,
      description: 'Авторизация пользователя',
      type: IntersectionType(CreateUserRDO, CreateUserAccessTokenRDO)
    }),
    ApiUnauthorizedResponse({ description: 'Некорректный логин/пароль пользователя' }),
  );
}