import { IsNumber, IsOptional, IsString, Max, Min, ValidationError, validateOrReject } from 'class-validator';

import { APP_PORT } from './config.constant';
import { ConfigAbstract } from './config.abstract';

export const ConfigEnum = {
  HOST: 'host',
  PORT: 'port',
  CORS_ACCESS_ENABLED_URLS: 'corsAccessEnabledURLs',
} as const;

export interface ConfigInterface {
  [ConfigEnum.HOST]: string;
  [ConfigEnum.PORT]: number;
  [ConfigEnum.CORS_ACCESS_ENABLED_URLS]: string;
}

export class ConfigSchema extends ConfigAbstract implements ConfigInterface {
  constructor() {
    super(ConfigSchema.name); // [App Config]
  }

  @IsString()
  host: string;

  @IsNumber()
  @Max(APP_PORT.MAX)
  @Min(APP_PORT.MIN)
  @IsOptional()
  port: number;

  @IsString()
  corsAccessEnabledURLs: string;
}
