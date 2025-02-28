import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { ENV_FILE_PATH } from './app.constant';

import {
  ConfigEnvironment,
  appConfig,
  jwtConfig,
  pgConfig
} from './config';
import { getDbOPtions } from '@libs/helpers';

@Module({
  imports: [
    // Конфигурация приложения
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ENV_FILE_PATH,
      load: [appConfig, pgConfig, jwtConfig]
    }),

    // Конфигурация подключения к БД
    SequelizeModule.forRootAsync(
      getDbOPtions(ConfigEnvironment.PG)
    ),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
