import { Logger } from '@nestjs/common';
import { IsString, validateOrReject, ValidationError } from 'class-validator';

import { ConfigMessages } from '../config.constant';

export const PGConfigEnum = {
  POSTGRES_URL: 'postgresURL',
  POSTGRES_USER: 'postgresUser',
  POSTGRES_PASSWORD: 'postgresPassword',
  POSTGRES_DB_NAME: 'postgresDatabaseName',
  POSTGRES_PORT: 'postgresPort',

  PGADMIN_DEFAULT_EMAIL: 'postgresAdminDefaultEmail',
  PGADMIN_DEFAULT_PASSWORD: 'postgresAdminDefaultPassword',
  PGADMIN_DEFAULT_PORT: 'postgresAdminDefaultPort',
} as const;

export interface PGConfigInterface {
  [PGConfigEnum.POSTGRES_URL]: string,
  [PGConfigEnum.POSTGRES_USER]: string,
  [PGConfigEnum.POSTGRES_PASSWORD]: string,
  [PGConfigEnum.POSTGRES_DB_NAME]: string,
  [PGConfigEnum.POSTGRES_PORT]: number,

  [PGConfigEnum.PGADMIN_DEFAULT_EMAIL]: string,
  [PGConfigEnum.PGADMIN_DEFAULT_PASSWORD]: string,
  [PGConfigEnum.PGADMIN_DEFAULT_PORT]: number,
};

export class PGConfigSchema implements PGConfigInterface {
  private readonly logger: Logger = new Logger(PGConfigSchema.name);

  @IsString()
  postgresURL: string;

  @IsString()
  postgresUser: string;

  @IsString()
  postgresPassword: string;

  @IsString()
  postgresDatabaseName: string;

  @IsString()
  postgresPort: number;


  @IsString()
  postgresAdminDefaultEmail: string;
  
  @IsString()
  postgresAdminDefaultPassword: string;

  @IsString()
  postgresAdminDefaultPort: number;

  async validate() {
    return await validateOrReject(this).catch((errors) => {
      this.logger.log(`[PG Config] ---> ${ConfigMessages.ERROR.VALIDATION}:`, errors);

      throw new ValidationError();
    })
  }
}