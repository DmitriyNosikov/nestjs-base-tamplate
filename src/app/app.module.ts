import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import {
  getSequelizeOptions,
  ConfigEnvironment,
  appConfig,
  jwtConfig,
  pgConfig
} from '@config/index';

import { ENV_FILE_PATH } from '@core/app.constant';

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
      getSequelizeOptions(ConfigEnvironment.PG)
    ),

    // Подключаем модули
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
