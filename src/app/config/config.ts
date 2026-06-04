import { ConfigType, registerAs } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { ConfigEnvironment, APP_PORT } from './config.constant';
import { ConfigInterface, ConfigSchema } from './config.schema';

type PromisifiedConfig = Promise<ConfigType<typeof getConfig>>;

async function getConfig(): Promise<ConfigInterface> {
  const port = process.env.PORT || String(APP_PORT.DEFAULT);

  const config = plainToClass(ConfigSchema, {
    port: parseInt(port, 10),
    host: process.env.HOST,
    corsAccessEnabledURLs: process.env.CORS_ACCESS_ENABLED_URLS,
  });

  await config.validate();

  return config;
}

export default registerAs(ConfigEnvironment.APP, async (): PromisifiedConfig => {
  return getConfig();
});
