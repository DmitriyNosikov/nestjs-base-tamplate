import { Logger } from '@nestjs/common';
import axios, { AxiosError, AxiosInstance } from 'axios';

import { getLoggerPrefix } from '../helpers/utils';

const TIMEOUT = 50000;
const LOGGER_PREFIX = getLoggerPrefix('[AXIOS]');

export function createAPI(
  baseUrl: string,
  timeout: number = TIMEOUT
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

export function createPerformanceAPI(
  baseUrl: string,
  apiToken: string,
  timeout: number = TIMEOUT
): AxiosInstance {
  if (!baseUrl) {
    throw new Error(`Не передан базовый URL для API`);
  }

  if (!apiToken) {
    throw new Error('Не передан токен для работы с Performance API');
  }

  const api = axios.create({
    baseURL: baseUrl,
    timeout: timeout
  });

  api.interceptors.request.use((config) => {
    config.headers['Authorization'] = `Bearer ${apiToken}`;

    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {      
      if (error?.response && error.response.data) {
        console.error(`${LOGGER_PREFIX} Ошибка выполнения запроса (статус: ${error.status}): `);
        console.error(`${LOGGER_PREFIX} Ответ от сервера: `, error.response.data);
        console.error(`${LOGGER_PREFIX} Параметры запроса: `, error.config);
      } else {
        console.error(`${LOGGER_PREFIX} Error: `, error);
      }

      // return Promise.reject(error);
    }
  );

  return api;
}
