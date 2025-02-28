import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ENV_FILE_PATH } from './app.constant';

import { appConfig, jwtConfig, pgConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ENV_FILE_PATH,
      load: [appConfig, pgConfig, jwtConfig]
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
