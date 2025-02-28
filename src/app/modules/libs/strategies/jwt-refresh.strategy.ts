import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { jwtConfig } from '../../../config';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TokenNotExistsException } from '../../refresh-token/exceptions/token-not-exists.exception';
import { RefreshTokenPayloadType } from '../types/token/token-payload.type';
import { RefreshTokenService } from '../../refresh-token/refresh-token.service';

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

    if(!isTokenExists) {
      throw new TokenNotExistsException(payload.tokenId);
    }

    return payload;
  }
}

