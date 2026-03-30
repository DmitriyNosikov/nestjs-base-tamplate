import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { USER_ROUTES } from './user.constant';

import { User } from '@models/index';
import { UserService } from './user.service';

import {
  JWTAuthGuard,
  JWTRefreshGuard,
  UserLocalAuthGuard,
  RoleGuard
} from '@common/guards';
import { RefreshTokenPayloadType, UserRolesTypeEnum, RequestWithUserPayloadType } from '@common/types';
import { Roles } from '@common/decorators/roles.decorator';
import { fillDTO } from '@libs/helpers';

import { CreateUserDTO } from './dto/create-user.dto';
import { CreateUserRDO } from './rdo/create-user.rdo';
import { CreateUserAccessTokenRDO } from './rdo/create-user-access-token.rdo';
import { UpdateUserRDO } from './rdo/update-user.rdo';
import { PaginatedUsersType } from './types/paginated-users.type';

import { ApiUserLogin } from './decorators/api-user-login.decorator';
import { ApiUserRefreshToken } from './decorators/api-user-refresh-token.decorator';
import { ApiGetUser } from './decorators/api-get-user.decorator';
import { ApiUpdateUser } from './decorators/api-update-user.decorator';
import { ApiDeleteUser } from './decorators/api-delete-user.decorator';
import { ApiPaginatedIndexUsers } from './decorators/api-paginated-index-users.decorator';
import { ApiCreateUser } from './decorators/api-create-user.decorator';
import { IndexUserDTO } from './dto/index-user.dto';

@Controller(USER_ROUTES.BASE)
export class UserController {
  constructor(
    private readonly userService: UserService
  ) { }

  @Post(USER_ROUTES.LOGIN)
  @UseGuards(UserLocalAuthGuard)
  @ApiUserLogin('Авторизация пользователя')
  public async login(
    @Req() { user: loggedUser }: RequestWithUserPayloadType<User>,
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
    @Req() { user: refreshTokenPayload }: RequestWithUserPayloadType<RefreshTokenPayloadType>
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
  @Roles(UserRolesTypeEnum.ADMIN)
  @UseGuards(JWTAuthGuard, RoleGuard)
  @ApiDeleteUser('Удаление пользователя')
  public async deleteUser(
    @Param('userId') userId: number
  ): Promise<void> {
    await this.userService.deleteUser(userId);
  }

  @Get(USER_ROUTES.INDEX)
  @UseGuards(JWTAuthGuard)
  @ApiPaginatedIndexUsers('Получение пагинированного списка пользователей')
  public async getUsersList(
    // TODO: Проверить передачу "лишних" параметров в query
    @Query() query: IndexUserDTO
  ): Promise<PaginatedUsersType> {
    const paginatedUsers = await this.userService.paginatedIndex(query);

    return paginatedUsers;
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
