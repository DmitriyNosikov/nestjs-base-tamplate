import { JwtModuleAsyncOptions } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config';

import { User } from 'src/app/models';

import { UserRolesType } from '../../types/roles.type';
import { UserTokenPayloadType } from '../../types/token/token-payload.type';

export function getJWTOptions(optionSpace: string): JwtModuleAsyncOptions {
  return {
    useFactory: async (configService: ConfigService) => {
      return {
        secret: configService.get<string>(`${optionSpace}.accessTokenSecret`),
        signOptions: {
          expiresIn: configService.get<string>(`${optionSpace}.accessTokenExpiresIn`),
          algorithm: 'HS256',
        }
      };
    },
    inject: [ConfigService]
  }
}

export function getUserJWTPayload(user: User): UserTokenPayloadType {
  return {
    userId: user.id,
    role: user.role as UserRolesType
  }
}