import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import {
  ApiParam,
  ApiResponse,
  PartialType
} from '@nestjs/swagger';

import { USER_ROUTES } from './user.constant';

import { JWTAuthGuard, JWTRefreshGuard, UserLocalAuthGuard } from '@core/common/guards';
import { fillDTO } from '@core/libs/helpers';
import { RefreshTokenPayloadType } from '@core/common/types';
import { IRequestWithUserPayload } from '@core/common/interfaces';


import { CreateUserDTO } from './dto/create-user.dto';
import { CreateUserRDO } from './rdo/create-user.rdo';
import { CreateUserAccessTokenRDO } from './rdo/create-user-access-token.rdo';

import { User } from '@models/index';
import { UserService } from './user.service';
import { UpdateUserRDO } from './rdo/update-user.rdo';
import { ApiUserLogin } from './decorators/api-user-login.decorator';
import { ApiUserRefreshToken } from './decorators/api-user-refresh-token.decorator';
import { ApiGetUser } from './decorators/api-get-user.decorator';
import { ApiUpdateUser } from './decorators/api-update-user.decorator';
import { ApiDeleteUser } from './decorators/api-delete-user.decorator';
import { ApiIndexUsers } from './decorators/api-paginated-index-users.decorator';
import { ApiCreateUser } from './decorators/api-create-user.decorator';

@Controller(USER_ROUTES.BASE)
export class UserController {
  constructor(
    private readonly userService: UserService
  ) { }

  @Post(USER_ROUTES.LOGIN)
  @UseGuards(UserLocalAuthGuard)
  @ApiUserLogin('Авторизация пользователя')
  public async login(
    @Req() { user: loggedUser }: IRequestWithUserPayload<User>,
  ): Promise<CreateUserRDO & CreateUserAccessTokenRDO> {
    const tokens = await this.userService.createToken(loggedUser.id);

    return {
      ...fillDTO(CreateUserRDO, loggedUser.toJSON()),
      ...tokens,
    };
  }

  @Post(USER_ROUTES.TOKEN_REFRESH)
  @UseGuards(JWTRefreshGuard)
  @ApiUserRefreshToken('Обновление токена доступа пользователя')
  public async refreshToken(
    @Req() { user: refreshTokenPayload }: IRequestWithUserPayload<RefreshTokenPayloadType>
  ): Promise<CreateUserAccessTokenRDO> {
    const tokens = await this.userService.refreshToken(refreshTokenPayload);

    return tokens;
  }

  @Get(USER_ROUTES.GET)
  @UseGuards(JWTAuthGuard)
  @ApiGetUser('Получение пользователя по id')
  public async getUserById(
    @Param('userId') userId: number
  ): Promise<CreateUserRDO> {
    const user = await this.userService.getUserById(userId);

    return user;
  }

  @Patch(USER_ROUTES.PATCH)
  @UseGuards(JWTAuthGuard)
  @ApiUpdateUser('Обновление данных пользователя')
  public async updateUser(
    @Param('userId') userId: number,
    @Body() updateData: Partial<CreateUserDTO>,
  ): Promise<UpdateUserRDO> {
    const updatedUser = await this.userService.updateUser(userId, updateData);

    return updatedUser;
  }

  @Delete(USER_ROUTES.DELETE)
  @UseGuards(JWTAuthGuard)
  @ApiDeleteUser('Удаление пользователя')
  public async deleteUser(
    @Param('userId') userId: number
  ): Promise<void> {
    await this.userService.deleteUser(userId);
  }

  @Get(USER_ROUTES.INDEX)
  @UseGuards(JWTAuthGuard)
  // TODO: Заменить на ApiPaginatedIndexUsers
  @ApiIndexUsers('Получение списка пользователей')
  public async getUsersList(): Promise<CreateUserRDO[] | null> {
    const users = await this.userService.index();

    return users;
  }

  @Post(USER_ROUTES.CREATE)
  @ApiCreateUser('Создание пользователя')
  public async createUser(
    @Body() userData: CreateUserDTO,
  ): Promise<CreateUserRDO | void> {
    const newUser = await this.userService.createUser(userData);

    return newUser;
  }
}
