import axios, { AxiosError, AxiosInstance } from 'axios';

const TIMEOUT = 50000;

export function createAPI(
  baseUrl: string,
  clientId: number,
  apiKey: string,
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
    config.headers['Client-id'] = clientId;
    config.headers['Api-key'] = apiKey;

    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {  
      if (error?.response && error.response.data) {
        console.log('[Axios] Ошибка выполнения запроса: ');
        console.log(error.response.data);

        return Promise.reject(error.response.data);
      } else {
        console.log('Error: ', error);
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
    throw new Error('Не передан базовый URL для API');
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
        console.error(`[Axios] Ошибка выполнения запроса (статус: ${error.status}): `);
        console.error('Ответ от сервера: ', error.response.data);
        console.error('Параметры запроса: ', error.config);
      } else {
        console.error('Error: ', error);
      }

      // return Promise.reject(error);
    }
  );

  return api;
}
