import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigEnvironment, JWTConfigEnum } from 'src/app/config';
@Injectable()
export class JWTAccessStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService
        .get<string>(`${ConfigEnvironment.JWT}.${JWTConfigEnum.JWT_ACCESS_TOKEN_SECRET}`)
    });
  }

  public async validate(payload) {
    Logger.log('JWT-token payload: ', payload);

    return payload;
  }
}

