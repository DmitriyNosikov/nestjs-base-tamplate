import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { jwtConfig } from '@core/config';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { RefreshTokenPayloadType } from '@core/common/types'
import { RefreshTokenService } from '@modules/refresh-token/refresh-token.service';
import { TokenNotExistsException } from '@modules/refresh-token/exceptions/token-not-exists.exception';

@Injectable()
export class JWTRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtOptions: ConfigType<typeof jwtConfig>,

    private readonly refreshTokenService: RefreshTokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtOptions.refreshTokenSecret
    });
  }

  public async validate(payload: RefreshTokenPayloadType) {
    const isTokenExists = await this.refreshTokenService.exists(payload.tokenId);

    if (!isTokenExists) {
      throw new TokenNotExistsException(payload.tokenId);
    }

    return payload;
  }
}

