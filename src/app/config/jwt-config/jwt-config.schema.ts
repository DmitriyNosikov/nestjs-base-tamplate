import { IsString, ValidationError, validateOrReject } from 'class-validator';
import { ConfigAbstract } from '../config.abstract';

export const JWTConfigEnum = {
  JWT_ACCESS_TOKEN_SECRET: 'accessTokenSecret',
  JWT_ACCESS_TOKEN_EXPIRES_IN: 'accessTokenExpiresIn',

  JWT_REFRESH_TOKEN_SECRET: 'refreshTokenSecret',
  JWT_REFRESH_TOKEN_EXPIRES_IN: 'refreshTokenExpiresIn',

} as const;

export interface JWTConfigInterface {
  [JWTConfigEnum.JWT_ACCESS_TOKEN_SECRET]: string,
  [JWTConfigEnum.JWT_ACCESS_TOKEN_EXPIRES_IN]: string,

  [JWTConfigEnum.JWT_REFRESH_TOKEN_SECRET]: string,
  [JWTConfigEnum.JWT_REFRESH_TOKEN_EXPIRES_IN]: string,
}

export class JWTConfigSchema extends ConfigAbstract implements JWTConfigInterface {
  constructor() {
    super(JWTConfigSchema.name); // [JWT Config]
  }

  @IsString()
  accessTokenSecret: string;

  @IsString()
  accessTokenExpiresIn: string;

  @IsString()
  refreshTokenSecret: string;

  @IsString()
  refreshTokenExpiresIn: string;
}
