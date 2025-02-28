import { ConfigService } from '@nestjs/config';
import { SequelizeModuleAsyncOptions } from '@nestjs/sequelize';

import { ConfigEnvironment } from 'src/app/config';
import { ConfigEnum } from 'src/app/config/config.schema';
import { PGConfigEnum } from 'src/app/config/pg-config/pg-config.schema';

// import {
//   User,
// } from 'src/app/models';

export function getDbOPtions(optionSpace: string): SequelizeModuleAsyncOptions {
  return {
    useFactory: async (configService: ConfigService) => ({
      dialect: 'postgres',
      host: configService.get<string>(
        `${ConfigEnvironment.APP}.${ConfigEnum.HOST}`,
      ),
      port: configService.get<number>(
        `${optionSpace}.${PGConfigEnum.POSTGRES_PORT}`,
      ),
      username: configService.get<string>(
        `${optionSpace}.${PGConfigEnum.POSTGRES_USER}`,
      ),
      password: configService.get<string>(
        `${optionSpace}.${PGConfigEnum.POSTGRES_PASSWORD}`,
      ),
      database: configService.get<string>(
        `${optionSpace}.${PGConfigEnum.POSTGRES_DB_NAME}`,
      ),

      autoLoadModels: true,
      // sync: { force: true },
      // synchronize: true, // Автоматически синхронизируем модели,
      sync: { alter: true },
      logging: false, // Отключаем логирование

      // Список моделей, которые необходимо
      // загрузить при конфигурировании sequelize
      models: [
        // User,
      ],
    }),
    inject: [ConfigService],
  };
}
