import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ConfigEnum, ConfigEnvironment } from '@config/index';

import { RequestLoggerInterceptor } from '@common/interceptors';
import { AppModule } from '@core/app.module';
import { GLOBAL_API_PREFIX } from '@core/app.constant';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const host = configService.get(`${ConfigEnvironment.APP}.${ConfigEnum.HOST}`);
  const port = configService.get(`${ConfigEnvironment.APP}.${ConfigEnum.PORT}`);

  const corsEnabledURLs = configService
    .get(`${ConfigEnvironment.APP}.${ConfigEnum.CORS_ACCESS_ENABLED_URLS}`)
    .split(', ');

  app.setGlobalPrefix(GLOBAL_API_PREFIX);  // Устанавливаем глобальный префикс для API
  app.enableCors({
    credentials: true,
    origin: [
      corsEnabledURLs
    ]
  }); // Подключаем работу с CORS

  // Подключаем валидацию DTO на основе class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // + трансформация типов данных на основе DTO,
      transformOptions: {
        exposeUnsetFields: false,
      }
    }),
  );

  // Логирование входящих запросов
  app.useGlobalInterceptors(new RequestLoggerInterceptor());

  // Запуск сервера (дефолтный порт указан в конфигурации приложения)
  await app.listen(port);

  Logger.log(`🚀 Application is running on: http://${host}:${port}/${GLOBAL_API_PREFIX}`);
}
bootstrap();
