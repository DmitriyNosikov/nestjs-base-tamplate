import { IsNumber, IsString } from 'class-validator';

import { ConfigAbstract } from '../config.abstract';

export const PGConfigEnum = {
  POSTGRES_URL: 'postgresURL',
  POSTGRES_USER: 'postgresUser',
  POSTGRES_PASSWORD: 'postgresPassword',
  POSTGRES_DB_NAME: 'postgresDatabaseName',
  POSTGRES_PORT: 'postgresPort'
} as const;

export interface PGConfigInterface {
  [PGConfigEnum.POSTGRES_URL]: string,
  [PGConfigEnum.POSTGRES_USER]: string,
  [PGConfigEnum.POSTGRES_PASSWORD]: string,
  [PGConfigEnum.POSTGRES_DB_NAME]: string,
  [PGConfigEnum.POSTGRES_PORT]: number,
};

export class PGConfigSchema extends ConfigAbstract implements PGConfigInterface {
  constructor() {
    super(PGConfigSchema.name); // [PG Config]
  }

  @IsString()
  postgresURL: string;

  @IsString()
  postgresUser: string;

  @IsString()
  postgresPassword: string;

  @IsString()
  postgresDatabaseName: string;

  @IsNumber()
  postgresPort: number;
}