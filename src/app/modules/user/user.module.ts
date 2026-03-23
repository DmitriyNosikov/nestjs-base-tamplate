import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';

import { BCryptHasher } from '@core/libs/helpers';
import { JWTAccessStrategy, JWTRefreshStrategy, UserLocalStrategy } from '@core/strategies';
import { getJWTOptions } from '@core/config/jwt/jwt';

import { User } from '@models/index';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

import { ConfigEnvironment } from '@core/config';
import { RefreshTokenModule } from '@modules/refresh-token/refresh-token.module';
@Module({
  imports: [
    SequelizeModule.forFeature([User]),

    JwtModule.registerAsync(
      getJWTOptions(ConfigEnvironment.JWT)
    ),

    RefreshTokenModule
  ],
  controllers: [UserController],
  providers: [
    UserLocalStrategy,
    JWTAccessStrategy,
    JWTRefreshStrategy,

    UserService,
    UserRepository,

    {
      provide: 'Hasher',
      useClass: BCryptHasher,
    },
  ],
  exports: [UserService, UserRepository]
})
export class UserModule { }