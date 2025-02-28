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

import { JWTAuthGuard, JWTRefreshGuard, UserLocalAuthGuard } from '@libs/guards';
import { fillDTO } from '@libs/helpers';
import { RefreshTokenPayloadType } from '@libs/types';
import { RequestWithPayloadInterface } from '@libs/interfaces';


import { CreateUserDTO } from './dto/create-user.dto';
import { CreateUserRDO } from './rdo/create-user.rdo';
import { CreateUserAccessTokenRDO } from './rdo/create-user-access-token.rdo';

import { User } from '@models/index';
import { UserService } from './user.service';
@Controller(USER_ROUTES.BASE)
export class UserController {
  constructor(
    private readonly userService: UserService
  ) { }

  @Post(USER_ROUTES.LOGIN)
  @UseGuards(UserLocalAuthGuard)
  public async login(
    @Req() { user: loggedUser }: RequestWithPayloadInterface<User>,
  ) {
    const tokens = await this.userService.createToken(loggedUser.id);

    return {
      ...fillDTO(CreateUserRDO, loggedUser.toJSON()),
      ...tokens,
    };
  }

  @Post(USER_ROUTES.TOKEN_REFRESH)
  @UseGuards(JWTRefreshGuard)
  public async refreshToken(
    @Req() { user: refreshTokenPayload }: RequestWithPayloadInterface<RefreshTokenPayloadType>
  ): Promise<CreateUserAccessTokenRDO> {
    const tokens = await this.userService.refreshToken(refreshTokenPayload);

    return tokens;
  }

  @Get(USER_ROUTES.GET)
  @UseGuards(JWTAuthGuard)
  public async getUserById(@Param('userId') userId: number): Promise<User> {
    const user = await this.userService.getUserById(userId);

    return user;
  }

  @Patch(USER_ROUTES.PATCH)
  @UseGuards(JWTAuthGuard)
  public async updateUser(
    @Param('userId') userId: number,
    @Body() updateData: Partial<CreateUserDTO>,
  ): Promise<User> {
    const updatedUser = await this.userService.updateUser(userId, updateData);

    return updatedUser;
  }

  @Delete(USER_ROUTES.DELETE)
  @UseGuards(JWTAuthGuard)
  public async deleteUser(@Param('userId') userId: number): Promise<void> {
    await this.userService.deleteUser(userId);
  }

  @Get(USER_ROUTES.INDEX)
  @UseGuards(JWTAuthGuard)
  public async getUsersList(): Promise<User[] | null> {
    const users = await this.userService.index();

    return users;
  }

  @Post(USER_ROUTES.CREATE)
  @UseGuards(JWTAuthGuard)
  // @UseInterceptors(InjectCompanyIdInterceptor)
  public async createUser(
    @Body() userData: CreateUserDTO,
  ): Promise<User | void> {
    const newUser = await this.userService.createUser({
      ...userData,
    });

    return newUser;
  }
}
