import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ConfigEnum, ConfigEnvironment } from '@config/index';
import { GLOBAL_API_PREFIX, SWAGGER_DOCS_PATH } from '@core/app.constant';

import { RequestLoggerInterceptor } from '@common/interceptors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from '@core/app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const host = configService.get(`${ConfigEnvironment.APP}.${ConfigEnum.HOST}`);
  const port = configService.get(`${ConfigEnvironment.APP}.${ConfigEnum.PORT}`);

  const corsEnabledURLs = configService
    .get(`${ConfigEnvironment.APP}.${ConfigEnum.CORS_ACCESS_ENABLED_URLS}`)
    .split(', ');

  // Устанавливаем глобальный префикс для API
  app.setGlobalPrefix(GLOBAL_API_PREFIX);

  // Подключаем работу с CORS
  app.enableCors({
    credentials: true,
    origin: [
      corsEnabledURLs
    ]
  });

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

  // Подключаем Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS Base Template')
    .setDescription('Базовый шаблон NestJS')
    .setVersion('1.0')
    .addTag('users', 'Эндпоинты для работы с пользователями')
    .build();

  /*
    Использование фабрики вместо прямого SwaggerModule.createDocument(app, swaggerConfig)
    позволяет сгенерировать документ только в момент его запроса,
    что уменьшает время инициализации приложения
    https://docs.nestjs.com/openapi/introduction
  */
  const swaggerDocumentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup(SWAGGER_DOCS_PATH, app, swaggerDocumentFactory);

  // Запуск сервера (дефолтный порт указан в конфигурации приложения)
  await app.listen(port);

  Logger.log(`🚀 Приложение запущено на: http://${host}:${port}/${GLOBAL_API_PREFIX}`);
  Logger.log(`🔗 Swagger документация доступна по адресу: http://${host}:${port}/${SWAGGER_DOCS_PATH}`);
}
bootstrap();
