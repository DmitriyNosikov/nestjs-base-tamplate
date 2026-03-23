import { Logger } from '@nestjs/common';
import axios, { AxiosError, AxiosInstance } from 'axios';

import { getLoggerPrefix } from '../helpers/utils';

const TIMEOUT = 50000;
const LOGGER_PREFIX = getLoggerPrefix('[AXIOS]');

export function createAPI(
  baseUrl: string,
  timeout: number = TIMEOUT,
  // apiToken: string,
): AxiosInstance {
  if (!baseUrl) {
    throw new Error('Не передан базовый URL для API');
  }

  const api = axios.create({
    baseURL: baseUrl,
    timeout: timeout
  });

  api.interceptors.request.use((config) => {
    // config.headers['Custom-header'] = '';
    // config.headers['Authorization'] = `Bearer ${apiToken}`;

    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error?.response && error.response.data) {
        Logger.error(`${LOGGER_PREFIX} Ошибка выполнения запроса: `);
        Logger.error(error.response.data);

        return Promise.reject(error.response.data);
      } else {
        Logger.error(`${LOGGER_PREFIX} Error:`, error);
      }

      return Promise.reject(error);
    }
  );

  return api;
}