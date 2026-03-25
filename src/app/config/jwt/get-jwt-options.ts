import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config';
import { ConfigEnvironment } from '../config.constant';
import { JWTConfigEnum } from '../jwt-config/jwt-config.schema';

export function getJWTOptions(optionSpace: string): JwtModuleAsyncOptions {
  return {
    useFactory: async (configService: ConfigService) => {
      const jwtConfigNamespace = optionSpace || ConfigEnvironment.JWT;
      const accessTokenSecret = configService.get<string>(`${jwtConfigNamespace}.${JWTConfigEnum.JWT_ACCESS_TOKEN_SECRET}`);
      const accessTokenExpiresIn = configService.get<string>(`${jwtConfigNamespace}.${JWTConfigEnum.JWT_ACCESS_TOKEN_EXPIRES_IN}`);

      const jwtConfigOptions: JwtModuleOptions = {
        secret: accessTokenSecret,
        signOptions: {
          expiresIn: accessTokenExpiresIn,
          algorithm: 'HS256',
        }
      };

      return jwtConfigOptions;
    },
    inject: [ConfigService]
  }
}