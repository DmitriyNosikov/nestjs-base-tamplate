import { Logger } from '@nestjs/common';
import { validateOrReject, ValidationError } from 'class-validator';


export class ConfigAbstract {
  private readonly logger: Logger = new Logger(ConfigAbstract.name);
  private readonly configName: string = '[App Config]';

  constructor(configName: string = this.configName) {
    this.configName = configName;
  }

  async validate() {
    return await validateOrReject(this)
      .catch((errors) => {
        this.logger.log(`${this.configName} ---> Ошибка валидации переменных окружения: `, errors);

        throw new ValidationError();
      });
  }
}