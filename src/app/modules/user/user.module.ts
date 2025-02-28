import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { User } from 'src/app/models';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

import { JwtModule } from '@nestjs/jwt';
import { BCryptHasher, getJWTOptions } from '../libs/helpers';
import { JWTAccessStrategy, UserLocalStrategy } from '../libs/strategies';

import { ConfigEnvironment } from 'src/app/config';
@Module({
  imports: [
    SequelizeModule.forFeature([User]),

    JwtModule.registerAsync(
      getJWTOptions(ConfigEnvironment.JWT)
    ),
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