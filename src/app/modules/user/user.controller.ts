import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

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

@Controller(USER_ROUTES.BASE)
export class UserController {
  constructor(
    private readonly userService: UserService
  ) { }

  @Post(USER_ROUTES.LOGIN)
  @UseGuards(UserLocalAuthGuard)
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
  public async refreshToken(
    @Req() { user: refreshTokenPayload }: IRequestWithUserPayload<RefreshTokenPayloadType>
  ): Promise<CreateUserAccessTokenRDO> {
    const tokens = await this.userService.refreshToken(refreshTokenPayload);

    return tokens;
  }

  @Get(USER_ROUTES.GET)
  @UseGuards(JWTAuthGuard)
  public async getUserById(
    @Param('userId') userId: number
  ): Promise<CreateUserRDO> {
    const user = await this.userService.getUserById(userId);

    return user;
  }

  @Patch(USER_ROUTES.PATCH)
  @UseGuards(JWTAuthGuard)
  public async updateUser(
    @Param('userId') userId: number,
    @Body() updateData: Partial<CreateUserDTO>,
  ): Promise<UpdateUserRDO> {
    const updatedUser = await this.userService.updateUser(userId, updateData);

    return updatedUser;
  }

  @Delete(USER_ROUTES.DELETE)
  @UseGuards(JWTAuthGuard)
  public async deleteUser(
    @Param('userId') userId: number
  ): Promise<void> {
    await this.userService.deleteUser(userId);
  }

  @Get(USER_ROUTES.INDEX)
  @UseGuards(JWTAuthGuard)
  public async getUsersList(): Promise<CreateUserRDO[] | null> {
    const users = await this.userService.index();

    return users;
  }

  @Post(USER_ROUTES.CREATE)
  @UseGuards(JWTAuthGuard)
  public async createUser(
    @Body() userData: CreateUserDTO,
  ): Promise<CreateUserRDO | void> {
    const newUser = await this.userService.createUser(userData);

    return newUser;
  }
}
