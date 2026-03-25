import { ConfigService } from '@nestjs/config';
import { SequelizeModuleAsyncOptions, SequelizeModuleOptions } from '@nestjs/sequelize';

import { ConfigEnvironment } from '@core/config';
import { ConfigEnum } from '@core/config/config.schema';
import { PGConfigEnum } from '@core/config/pg-config/pg-config.schema';

import {
  RefreshToken,
  User
} from '@models/index';

export function getSequelizeOptions(optionSpace: string): SequelizeModuleAsyncOptions {
  return {
    useFactory: async (configService: ConfigService) => {
      const pgConfigNamespace = optionSpace || ConfigEnvironment.PG;
      const appConfigNamespace = ConfigEnvironment.APP;

      const dbHost = configService.get<string>(
        `${appConfigNamespace}.${ConfigEnum.HOST}`,
      );
      const dbPort = configService.get<number>(
        `${pgConfigNamespace}.${PGConfigEnum.POSTGRES_PORT}`,
      );
      const dbUser = configService.get<string>(
        `${pgConfigNamespace}.${PGConfigEnum.POSTGRES_USER}`,
      );
      const dbPassword = configService.get<string>(
        `${pgConfigNamespace}.${PGConfigEnum.POSTGRES_PASSWORD}`,
      );
      const dbDatabase = configService.get<string>(
        `${pgConfigNamespace}.${PGConfigEnum.POSTGRES_DB_NAME}`,
      );

      const sequelizeConfig: SequelizeModuleOptions = {
        dialect: 'postgres',
        host: dbHost,
        port: dbPort,
        username: dbUser,
        password: dbPassword,
        database: dbDatabase,

        autoLoadModels: true,
        // sync: { force: true },
        // synchronize: true, // Автоматически синхронизируем модели,
        sync: { alter: true },
        logging: false, // Отключаем логирование

        // Список моделей, которые необходимо
        // загрузить при конфигурировании sequelize
        models: [
          User,
          RefreshToken
        ],
      };

      return sequelizeConfig;
    },
    inject: [ConfigService],
  };
}
