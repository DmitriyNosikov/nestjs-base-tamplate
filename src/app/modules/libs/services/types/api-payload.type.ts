export type OzonCredentialsType = {
  clientId: number,
  apiKey: string,
}

export const ReportInfoReportTypeEnum = {
  SELLER_PRODUCTS: 'SELLER_PRODUCTS',
  SELLER_TRANSACTIONS: 'SELLER_TRANSACTIONS',
  SELLER_PRODUCT_PRICES: 'SELLER_PRODUCT_PRICES',
  SELLER_STOCK: 'SELLER_STOCK',
  SELLER_RETURNS: 'SELLER_RETURNS',
  SELLER_POSTINGS: 'SELLER_POSTINGS',
  SELLER_FINANCE: 'SELLER_FINANCE',
  SELLER_PRODUCT_DISCOUNTED: 'SELLER_PRODUCT_DISCOUNTED',
  DOCUMENT_B2B_SALES: 'DOCUMENT_B2B_SALES',
  MUTUAL_SETTLEMENT: 'MUTUAL_SETTLEMENT',
  SELLER_RETURNS_V2: 'SELLER_RETURNS_V2'
} as const;
export type ReportInfoReportType = (typeof ReportInfoReportTypeEnum)[keyof typeof ReportInfoReportTypeEnum];

export const ReportInfoStatusEnum = {
  WAITING: 'waiting',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  FAILED: 'failed',
} as const;
export type ReportInfoStatusType = (typeof ReportInfoStatusEnum)[keyof typeof ReportInfoStatusEnum];

export const AdvReportInfoStateEnum = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  ERROR: 'ERROR',
  OK: 'OK ',
} as const;
export type AdvReportInfoStateType = (typeof AdvReportInfoStateEnum)[keyof typeof AdvReportInfoStateEnum];

export const AdvCampaignTypeEnum = {
  SKU: 'SKU', // - Трафареты или Вывод в топ
  BANNER: 'BANNER', // - Баннерная рекламная кампания
  SEARCH_PROMO: 'SEARCH_PROMO', // - Продвижение в поиске
} as const;
export type AdvCampaignType = (typeof AdvCampaignTypeEnum)[keyof typeof AdvCampaignTypeEnum];

// CAMPAIGN_STATE_UNKNOWN - любая кампания
// CAMPAIGN_STATE_RUNNING - активная кампания
// CAMPAIGN_STATE_FINISHED - кампания завершена, дата окончания в прошлом,
// такую кампанию нельзя изменить, можно только клонировать или создать новую
// CAMPAIGN_STATE_PLANNED - кампания, сроки проведения которой ещё не наступили
// CAMPAIGN_STATE_STOPPED - кампания, приостановленная из-за нехватки бюджета
// CAMPAIGN_STATE_INACTIVE - кампания, остановленная владельцем
// CAMPAIGN_STATE_ARCHIVED - архивная кампания
// CAMPAIGN_STATE_MODERATION_DRAFT - отредактированная кампания до отправки на модерацию
// CAMPAIGN_STATE_MODERATION_IN_PROGRESS - кампания, отправленная на модерацию
// CAMPAIGN_STATE_MODERATION_FAILED - кампания, непрошедшая модерацию
export const AdvCampaignStateEnum = {
  CAMPAIGN_STATE_UNKNOWN: 'CAMPAIGN_STATE_UNKNOWN',
  CAMPAIGN_STATE_RUNNING: 'CAMPAIGN_STATE_RUNNING',
  CAMPAIGN_STATE_FINISHED: 'CAMPAIGN_STATE_FINISHED',
  CAMPAIGN_STATE_PLANNED: 'CAMPAIGN_STATE_PLANNED',
  CAMPAIGN_STATE_STOPPED: 'CAMPAIGN_STATE_STOPPED',
  CAMPAIGN_STATE_INACTIVE: 'CAMPAIGN_STATE_INACTIVE',
  CAMPAIGN_STATE_ARCHIVED: 'CAMPAIGN_STATE_ARCHIVED',
  CAMPAIGN_STATE_MODERATION_DRAFT: 'CAMPAIGN_STATE_MODERATION_DRAFT',
  CAMPAIGN_STATE_MODERATION_IN_PROGRESS: 'CAMPAIGN_STATE_MODERATION_IN_PROGRESS',
  CAMPAIGN_STATE_MODERATION_FAILED: 'CAMPAIGN_STATE_MODERATION_FAILED',
} as const;
export type AdvCampaignStateType = (typeof AdvCampaignStateEnum)[keyof typeof AdvCampaignStateEnum];

export type ReportInfoResponseType = {
  result: {
    code: string,
    created_at: string,
    error: string,
    file: string, // Ссылка на XLSX-файл
    params: Record<string, unknown>,
    report_type: ReportInfoReportType,
    status: ReportInfoStatusType
  }
}

export type ReportAdvInfoResponseType = {
  UUID: string, // Уникальный идентификатор запроса, для которого производилась проверка.
  state: AdvReportInfoStateType,
  createdAt: Date, // Дата и время получения запроса сервером, часовой пояс UTC.
  updatedAt: Date, // Дата и время последнего обновления состояния запроса, часовой пояс UTC.
  request: Record<string, unknown>, // Исходная структура запроса
  kind: // Тип запрашиваемого отчёта:
  'STATS' |  // отчёт по поисковым фразам и по категории товаров;
  'SEARCH_PHRASES' |  // отчёт по поисковым фразам и по категории товаров;
  'ATTRIBUTION' |  // отчёт по заказам для продвижения в поиске;
  'VIDEO'; // отчёт по показам видеобаннера.
  error?: string, // Краткое описание возникшей ошибки.
  link?: string, // Относительная ссылка на отчёт в формате CSV.
}

export type ReportCreateTaskResponseType = {
  result: {
    code: string
  }
}

export type PerformanceApiTokenResponseType = {
  data: {
    access_token: string,
    expires_in: number,
    Bearer: string
  }
}

export type ProductTaskPayloadType = {
  offerId?: string[],
  sku?: number[]
}

export type StocksOnWarehousesPayloadType = {
  limit?: number, // Количество товаров
  offset?: number, // Сколько пропустить
  translit?: boolean, // Если включена транслитерация адреса из кириллицы в латиницу — true
  dir?: 'asc' | 'desc', // Направление сортировки по возрастанию / убыванию
}

type PostingsWithData = {
  analyticsData?: boolean, // Передайте true, чтобы добавить в ответ данные аналитики.
  financialData?: boolean, // Передайте true, чтобы добавить в ответ финансовые данные.
};

export type PostingFboListPayloadType = {
  dateFrom: string,
  dateTo: string,
  dir?: 'asc' | 'desc', // Направление сортировки
  limit?: number,
  offset?: number,
  withData?: PostingsWithData
}

// Перечислены на все возможные фильтры, а только те,
// которые на первый взгляд могут пригодиться
// https://api-seller.ozon.ru/v3/finance/transaction/list
// page от 1, обязателен к передаче
// pageSize от 0 до 1000, обязателен к передаче
export type FinanceTransactionsPayloadType = {
  dateFrom?: string,
  dateTo?: string,
  page?: number // Номер страницы, возвращаемой в запросе
  pageSize?: number // Количество элементов на странице
}

export type PostingDeliverySchema =
  'fbo' | // FBO (Заказы со склада Ozon)
  'fbs'; // FBS (Заказы с моих складов)

// delivery_schema - обязательный к передаче параметр
export type PostingsReportCreateTaskPayloadType = {
  dateFrom?: string | Date, // Время, когда заказ попал в обработку
  dateTo?: string | Date, // Время, когда заказ появился в личном кабинете
  deliverySchema?: PostingDeliverySchema[], // Схема работы
  offerId?: string, // Артикул товара
  sku?: number[], // Идентификатор товара в системе Ozon
  title?: string // Название товара
}

export type AdvCampaignListPayloadType = {
  campaignIds?: string[], // Идентификаторы рекламных кампаний
  campaignType?: AdvCampaignType, // Тип рекламной кампании
  state?: AdvCampaignStateType // Текущий статус рекламной кампании
}

export type CreateAdvStatisticsTaskPayloadType = {
  // Список идентификаторов кампаний, для которых необходимо подготовить отчёт.
  // метод для получения идентификаторов - getCampaignList
  campaignIds: string[],
  dateFrom?: string | Date,
  dateTo?: string | Date,
}