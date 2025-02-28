import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { RefreshToken } from '@models/index';

import { RefreshTokenService } from './refresh-token.service';
import { RefreshTokenRepository } from './refresh-token.repository';


@Module({
  imports: [
    SequelizeModule.forFeature([RefreshToken]),
  ],
  controllers: [],
  providers: [RefreshTokenService, RefreshTokenRepository],
  exports: [RefreshTokenService, RefreshTokenRepository]
})
export class RefreshTokenModule { }
