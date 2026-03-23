import { JwtModuleAsyncOptions } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config';

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