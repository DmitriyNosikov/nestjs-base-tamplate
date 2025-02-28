import { Logger } from '@nestjs/common';
import axios, { AxiosError, HttpStatusCode } from 'axios';

import { createAPI, createPerformanceAPI } from './api'
import { checkPeriodLimits, formatDateToOzonISO, omitUndefined } from '../helpers';

import {
  AdvCampaignListPayloadType,
  CreateAdvStatisticsTaskPayloadType,
  FinanceTransactionsPayloadType,
  PostingFboListPayloadType,
  PostingsReportCreateTaskPayloadType,
  ProductTaskPayloadType,
  ReportInfoResponseType,
  ReportCreateTaskResponseType,
  StocksOnWarehousesPayloadType,
  PerformanceApiTokenResponseType,
  AdvCampaignTypeEnum,
  AdvCampaignStateEnum,
  ReportAdvInfoResponseType
} from './types/api-payload.type';

import {
  AdvCampaignListResponseType,
  AdvStatisticsTaskResponseType,
  AdvStatisticsReportJSONResponseType,
  FinanceTransactionResponseType,
  PostingFboListResponseType,
  StockOnWarehousesResponseType
} from '.';
import { ApiLimits } from '../../report/report.constant';


const OzonApiUrls = {
  // --- Seller API
  // Получение отчета
  REPORTS_INFO: 'https://api-seller.ozon.ru/v1/report/info',

  // Получение списка рекламных кампаний
  ADV_CAMPAIGN_LIST: 'https://api-performance.ozon.ru:443/api/client/campaign',

  // 1. Номенклатура
  PRODUCTS_REPORT_CREATE: 'https://api-seller.ozon.ru/v1/report/products/create',

  // 4. Остатки
  STOCKS_AND_PRODUCTS: 'https://api-seller.ozon.ru/v2/analytics/stock_on_warehouses',
  POSTING_FBO_LIST: 'https://api-seller.ozon.ru/v2/posting/fbo/list',
  PRODUCT_INFO_PRICES: 'https://api-seller.ozon.ru/v4/product/info/prices',

  // 5. Фин. отчет
  FINANCE_TRANSACTION_LIST: 'https://api-seller.ozon.ru/v3/finance/transaction/list',

  // 6. Хранение (отчет по остаткам и товарам на складах)
  STOCKS_ON_WAREHOUSES: 'https://api-seller.ozon.ru/v2/analytics/stock_on_warehouses',

  // 8. Отчет по поставкам (отчет об отправлениях)
  POSTINGS_REPORT_CREATE: 'https://api-seller.ozon.ru/v1/report/postings/create',

  // --- Performance API
  // Получение отчета по рекламной статистике
  STATISTICS_REPORT: 'https://api-performance.ozon.ru:443/api/client/statistics/report',

  // Базовый URL, относительно которого собирается ссылка
  // для скачивания отчета по рекламной статистике
  // Формат: https://api-performance.ozon.ru/api/client/statistics/report?{UUID}
  // + Authorization: bearer {apiKey}
  STATISTICS_REPORT_DOWNLOAD: 'https://api-performance.ozon.ru',

  // Получение токена
  GET_PERFORMANCE_TOKEN: 'https://api-performance.ozon.ru/api/client/token',

  // Получение отчета по рекламе (в URL + {UUID})
  ADV_REPORTS_INFO: 'https://api-performance.ozon.ru:443/api/client/statistics',

  // 2. Трафареты (статистика по кампании)
  STATISTICS: 'https://api-performance.ozon.ru:443/api/client/statistics',
  STATISTICS_JSON: 'https://api-performance.ozon.ru:443/api/client/statistics/json',
  STATISTICS_ATTRIBUTION: 'https://api-performance.ozon.ru:443/api/client/statistics/attribution',
}

const logger = new Logger('Ozon-API');

// --- Статусы по ReportInfoReportType отчетов
// Для отчета с типом SELLER_RETURNS ссылка на скачивание файла доступна в течение 5 минут
// https://docs.ozon.ru/api/seller/#operation/ReportAPI_ReportInfo
export async function getReportInfo(
  clientId: number,
  apiKey: string,
  reportId: string
): Promise<ReportInfoResponseType> {
  const reportInfoApi = createAPI(OzonApiUrls.REPORTS_INFO, clientId, apiKey);

  try {
    const result = await reportInfoApi.post('', { code: reportId });

    return result.data;
  } catch (error) {
    logger.log(error);
  }
}

// --- 1. Номенклатура
// https://docs.ozon.ru/api/seller/#operation/ReportAPI_CreateCompanyProductsReport
export async function createProductsTask(
  clientId: number,
  apiKey: string,
  payload?: ProductTaskPayloadType
): Promise<ReportCreateTaskResponseType> {
  const productsApi = createAPI(OzonApiUrls.PRODUCTS_REPORT_CREATE, clientId, apiKey);
  const apiPayload = {
    offer_id: payload.offerId,
    sku: payload.sku,
  };

  try {
    const result = await productsApi.post('', apiPayload);

    return result.data;
  } catch (error) {
    logger.error('Ошибка создания задачи на выгрузку номенклатуры: ', error);
  }

  return null;
}

// --- 4. Остатки на складах озон
// --- 6. Хранение
// Данные можно запрашивать не более чем 1 раз в минуту
// Данные доступны за последние 3 месяца
// Не более 1000 товаров на страницу
export async function getStocksOnWarehouses(
  clientId: number,
  apiKey: string,
  payload?: StocksOnWarehousesPayloadType
): Promise<StockOnWarehousesResponseType> {
  const stocksApi = createAPI(OzonApiUrls.STOCKS_ON_WAREHOUSES, clientId, apiKey);
  const { dir, limit, offset, translit } = payload;
  const apiPayload = {
    dir,
    translit,
    limit,
    offset
  }

  try {
    const result = await stocksApi.post('', apiPayload);

    return result.data;
  } catch (error) {
    logger.log(error);
  }
}

// Список отправлений за указанный период
// Период не должен превышать 1 год,
// иначе получим ошибку PERIOD_IS_TOO_LONG
export async function getPostingFboList(
  clientId: number,
  apiKey: string,
  payload?: PostingFboListPayloadType
): Promise<PostingFboListResponseType> {
  const postingFboListApi = createAPI(OzonApiUrls.POSTING_FBO_LIST, clientId, apiKey);

  const {
    dateFrom,
    dateTo,
    dir,
    limit,
    offset,
    withData
  } = payload;

  const { POSTINGS } = ApiLimits;

  checkPeriodLimits(dateFrom, dateTo, POSTINGS.MIN_DAYS_DELTA, POSTINGS.MAX_DAYS_DELTA);

  const parsedWith = withData
    ? withData
    : {
      analytics_data: true,
      financial_data: true
    }

  const apiPayload = omitUndefined<PostingFboListPayloadType>({
    filter: {
      since: dateFrom,
      to: dateTo,
    },
    dir,
    limit,
    offset,
    with: parsedWith
  });

  try {
    const result = await postingFboListApi.post('', apiPayload);

    return result.data;
  } catch (error) {

    if (error.code && error.message) {
      const { code, message } = error;

      // Если достигнут Offset Limit
      if (code === 3 && message === 'MAX_OFFSET_EXCEEDED') {
        return null;
      }
    }

    logger.log(error);
  }
}


// --- 5. Фин. отчет
// Максимальные период в одном запросе - 1 месяц
// https://api-seller.ozon.ru/v3/finance/transaction/list
export async function getFinanceTransactions(
  clientId: number,
  apiKey: string,
  payload?: FinanceTransactionsPayloadType
): Promise<FinanceTransactionResponseType> {
  const financeTransactionsApi = createAPI(OzonApiUrls.FINANCE_TRANSACTION_LIST, clientId, apiKey);
  const { dateFrom, dateTo, page, pageSize } = payload;

  // TODO: Вынести все подобные "магические"
  // значения и ограничения в отдельные константы
  checkPeriodLimits(
    dateFrom,
    dateTo,
    ApiLimits.TRANSACTIONS.MIN_DAYS_DELTA,
    ApiLimits.TRANSACTIONS.MAX_DAYS_DELTA
  );

  const apiPayload = omitUndefined({
    filter: {
      date: {
        // Ozon API неверно парсит дату, переданную в стандартном
        // формате ISO 8601
        from: formatDateToOzonISO(dateFrom),
        to: formatDateToOzonISO(dateTo)
      }
    },
    page,
    page_size: pageSize,
  });

  try {
    const result = await financeTransactionsApi.post('', apiPayload);

    return result.data;
  } catch (error) {
    logger.log(error);
  }
}


// --- 8. Отчет по поставкам (отправлениям)
// https://api-seller.ozon.ru/v1/report/postings/create
// delivery_schema - обязательно должна быть передана:
// fbo - чтобы получить отчёт по схеме FBO
// fbs - чтобы получить отчёт по схеме FBS
// Один запрос - одна схeма
export async function createPostingsReportTask(
  clientId: number,
  apiKey: string,
  payload?: PostingsReportCreateTaskPayloadType
): Promise<ReportCreateTaskResponseType> {
  const createPostingsTaskApi = createAPI(OzonApiUrls.POSTINGS_REPORT_CREATE, clientId, apiKey);
  const { dateFrom, dateTo, deliverySchema, offerId, sku, title } = payload;
  const { REPORT } = ApiLimits;

  checkPeriodLimits(dateFrom, dateTo, REPORT.MIN_DAYS_DELTA, REPORT.MAX_DAYS_DELTA);

  const apiPayload = omitUndefined<PostingsReportCreateTaskPayloadType>({
    filter: {
      processed_at_from: dateFrom,
      processed_at_to: dateTo,
      delivery_schema: deliverySchema,
      offerId,
      sku,
      title
    }
  });

  try {
    const result = await createPostingsTaskApi.post('', apiPayload);

    return result.data;
  } catch (error) {
    logger.log(error);
  }
}

// --- Performance API
// https://docs.ozon.ru/api/performance/#tag/Limits
/* 
  Общий лимит на количество запросов в сутки — 100 000.
  Лимиты на выгрузки статистики проверяются в начале формирования отчёта. Лимиты действуют для отчётов из раздела Статистика.
  Одна рекламная кампания = одна выгрузка. Если в запросе несколько кампаний, это считается как несколько выгрузок.
  Лимит на количество выгрузок в сутки рассчитывается по формуле: количество активных кампаний × 240 — но не больше значения из таблицы ниже.
  Лимиты на выгрузки:
  Лимит на количество дней в выгрузке	62
  Лимит на количество кампаний в отчёте	10
  Лимит на количество одновременных выгрузок с аккаунта	1
  Лимит на количество выгрузок за 24 часа с аккаунта	2000
  Лимиты на количество одновременных выгрузок по организации	5
  Лимит на количество выгрузок за 24 часа в рамках организации	2000
*/
export async function getPerformanceApiKey(
  performanceClientId: string,
  clientSecret: string
): Promise<PerformanceApiTokenResponseType> {
  const performanceApiInstance = axios.create({
    baseURL: OzonApiUrls.GET_PERFORMANCE_TOKEN
  });
  const performancePayload = {
    client_id: performanceClientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials'
  };

  try {
    logger.log('Запрашиваем новый Performance API Key ...');

    const performanceApiToken: PerformanceApiTokenResponseType = await performanceApiInstance.post('', performancePayload);

    logger.log('Получен новый Performance API Key');

    return performanceApiToken;
  } catch (error) {
    logger.error(error);

    throw new Error(`Не удалось получить токен доступа к Performance API: ${error}`);
  }
}

let hasNewTokenBeenRequested = false;

// Проверить статус отчета по статистике
export async function getAdvReportInfo(
  uuid: string, // номер задачи на формирование отчета
  apiKey: string,
  performanceClientId?: string,
  clientSecret?: string
): Promise<ReportAdvInfoResponseType> {
  const advReportInfoApi = createPerformanceAPI(OzonApiUrls.ADV_REPORTS_INFO, apiKey);

  try {
    const result = await advReportInfoApi.get(`/${uuid}`);

    hasNewTokenBeenRequested = false;

    return result.data;
  } catch (error) {
    logger.log(error);

    // Возможность повторно запросить токен
    // TODO: Подумать, как это унифицировать,
    // чтобы не передавать во все методы, работающие
    // с PerformanceAPI Key данные для получения
    // нового токена, в случае чего
    // Может делать это в Axios через интерцептор ответа?
    if (
      error instanceof AxiosError
      && +error.code === HttpStatusCode.Forbidden
      && !hasNewTokenBeenRequested
      && (performanceClientId && clientSecret)
    ) {
      hasNewTokenBeenRequested = true;
      const { data } = await getPerformanceApiKey(performanceClientId, clientSecret);

      if (!data) {
        return;
      }

      const newPerformanceApiKey = data.access_token;

      return await getAdvReportInfo(uuid, newPerformanceApiKey);
    }
  }
}

// Скачать отчет
export async function downloadAdvStatisticsReport(
  apiKey: string,
  relativeReportLink: string
): Promise<AdvStatisticsReportJSONResponseType> {
  const advStatisticsReportApi = createPerformanceAPI(OzonApiUrls.STATISTICS_REPORT_DOWNLOAD, apiKey);

  try {
    const advReport = await advStatisticsReportApi.get(relativeReportLink);

    return advReport.data;
  } catch (error) {
    logger.log(error);
  }
}

// --- 2. Трафареты
// --- 3. Реклама и продвижение в поиске
// Список рекламных кампаний
export async function getCampaignList(
  apiKey: string,
  payload?: AdvCampaignListPayloadType
): Promise<AdvCampaignListResponseType> {
  const advCampaignListApi = createPerformanceAPI(OzonApiUrls.ADV_CAMPAIGN_LIST, apiKey);
  const apiPayload = {
    campaignIds: payload.campaignIds ?? [],
    advObjectType: payload.campaignType ?? AdvCampaignTypeEnum.SKU,
    state: payload.state ?? AdvCampaignStateEnum.CAMPAIGN_STATE_UNKNOWN
  };

  try {
    const result = await advCampaignListApi.get('', {
      params: apiPayload
    });

    return result.data;
  } catch (error) {
    logger.log(error);
  }
}

// Получить список рекламных кампаний-трафаретов
export async function getAdvStencilList(
  apiToken: string,
  payload?: AdvCampaignListPayloadType
): Promise<AdvCampaignListResponseType> {
  const apiPayload = {
    campaignIds: payload.campaignIds ?? [],
    advObjectType: AdvCampaignTypeEnum.SKU,
    state: payload.state ?? AdvCampaignStateEnum.CAMPAIGN_STATE_RUNNING
  };

  return await getCampaignList(apiToken, apiPayload);
}

// Получить список рекламных кампаний-продвижений в поиске
export async function getAdvSearchList(
  apiToken: string,
  payload?: AdvCampaignListPayloadType
): Promise<AdvCampaignListResponseType> {
  const apiPayload = {
    campaignIds: payload.campaignIds ?? [],
    advObjectType: AdvCampaignTypeEnum.SEARCH_PROMO,
    state: payload.state ?? AdvCampaignStateEnum.CAMPAIGN_STATE_RUNNING
  };

  return await getCampaignList(apiToken, apiPayload);
}

/* 
  Общий лимит на количество запросов в сутки — 100 000.

  Лимиты на выгрузки статистики проверяются в начале формирования отчёта. 

  Одна рекламная кампания = одна выгрузка. 
  Если в запросе несколько кампаний, это считается как несколько выгрузок.

  Лимит на количество выгрузок в сутки рассчитывается по формуле: 
  количество активных кампаний × 240 — но не больше значения из таблицы ниже.

  Максимальный период, за который можно получить отчёт — 62 дня.
  Максимальное количество кампаний за раз - 10

  Лимит на количество одновременных выгрузок с аккаунта - 1
  Лимит на количество выгрузок за 24 часа с аккаунта - 2000

  Лимиты на количество одновременных выгрузок по организации - 5
  Лимит на количество выгрузок за 24 часа в рамках организации - 2000

  dateFrom/dateTo / from/to - обязательны к передаче

  JSON - если запросили отчет в JSON-формате
  CSV — если в списке одна кампания.
  ZIP архив — если в списке несколько кампаний. 
  Каждый файл соответствует одной кампании из списка. 
  Имя файла вида <идентификатор кампании>.csv.

  Основной метод:
  https://api-performance.ozon.ru:443/api/client/statistics

  Доп. методы (если не хватит основного):
  https://api-performance.ozon.ru:443/api/client/statistics/attribution
  https://api-performance.ozon.ru:443/api/client/statistics/campaign/product
*/
export async function createAdvStatisticsTask(
  apiKey: string,
  payload?: CreateAdvStatisticsTaskPayloadType
): Promise<AdvStatisticsTaskResponseType | AxiosError> {
  const advStatisticsApi = createPerformanceAPI(OzonApiUrls.STATISTICS_JSON, apiKey);
  const { dateFrom, dateTo, campaignIds } = payload;
  const { STATISTICS } = ApiLimits;

  checkPeriodLimits(dateFrom, dateTo, STATISTICS.MIN_DAYS_DELTA, STATISTICS.MAX_DAYS_DELTA);

  try {
    const campaignStatistics = await advStatisticsApi.post('', {
      from: dateFrom,
      to: dateTo,
      campaigns: campaignIds,
      groupBy: 'DATE'
    });

    if (campaignStatistics) {
      return campaignStatistics.data;
    }
  } catch (error) {
    logger.error('Не удалось сформировать задачу на получение рекламной статистики: ', error);

    if (error instanceof AxiosError) {
      return error;
    }

    throw new Error(error);
  }
}