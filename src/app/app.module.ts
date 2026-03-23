import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { getDbOPtions } from '@core/libs/helpers';

import { ENV_FILE_PATH } from '@core/app.constant';

import {
  ConfigEnvironment,
  appConfig,
  jwtConfig,
  pgConfig
} from '@core/config/';

import { UserModule } from '@modules/user/user.module';

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

    // Подключаем модули
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
