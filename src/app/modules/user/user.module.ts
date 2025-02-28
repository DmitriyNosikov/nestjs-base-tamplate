import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';

import { BCryptHasher, getJWTOptions } from '@libs/helpers';
import { JWTAccessStrategy, UserLocalStrategy } from '@libs/strategies';

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