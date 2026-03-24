import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';

import { getJWTOptions, ConfigEnvironment } from '@config/index';
import { BCryptHasher } from '@libs/helpers';
import { JWTAccessStrategy, JWTRefreshStrategy, UserLocalStrategy } from '@core/common/strategies';

import { User } from '@models/index';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

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