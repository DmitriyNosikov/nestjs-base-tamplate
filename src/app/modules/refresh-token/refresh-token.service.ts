import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { jwtConfig } from '@core/config';

import { getJWTExpirationDate } from '@core/libs/helpers';
import { RefreshTokenPayloadType } from '@core/types';

import { CreateRefreshTokenDTO } from './dto/create-refresh-token.dto';

import { RefreshTokenRepository } from './refresh-token.repository';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,

    @Inject(jwtConfig.KEY)
    private readonly jwtOptions: ConfigType<typeof jwtConfig>,
  ) { }

  public async createRefreshSession(payload: CreateRefreshTokenDTO) {
    const expiresIn = payload.expiresIn
      ?? getJWTExpirationDate(this.jwtOptions.refreshTokenExpiresIn);

    const refreshTokenDto: RefreshTokenPayloadType = {
      userId: payload.userId,
      expiresIn: expiresIn,
      tokenId: payload.tokenId
    };

    const refreshToken = await this.refreshTokenRepository.create(refreshTokenDto);

    return refreshToken;
  }

  public async deleteRefreshSession(tokenId: string): Promise<void> {
    await this.deleteExpiredRefreshTokens();
    await this.refreshTokenRepository.deleteByTokenId(tokenId)
  }

  public async exists(tokenId: string): Promise<boolean> {
    const refreshToken = await this.refreshTokenRepository.findByTokenId(tokenId);
    return (refreshToken !== null);
  }

  public async deleteExpiredRefreshTokens() {
    await this.refreshTokenRepository.deleteExpiredTokens();
  }
}
