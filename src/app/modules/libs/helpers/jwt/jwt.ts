import { JwtModuleAsyncOptions } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config';

import { User } from '@models/index';

import { UserRolesType } from '@libs/types/index';
import { UserTokenPayloadType } from '@libs/types/index';

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