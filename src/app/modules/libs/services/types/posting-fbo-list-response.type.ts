import {
  AdditionalDataType,
  AnalyticsDataType,
  FinancialDataType,
  ProductInDeliveryType,
  StatusType
} from 'src/app/models'

type PostingFboListType = {
  // https://docs.ozon.ru/api/seller/#operation/PostingAPI_GetFboPostingListц
  additional_data: AdditionalDataType[],
  analytics_data: AnalyticsDataType, // Данные аналитики
  cancel_reason_id: string, // Идентификатор причины отмены отправления
  created_at: Date, // Дата и время создания отправления
  financial_data: FinancialDataType, // Финансовые данные.
  in_process_at: string, // Дата и время начала обработки отправления.
  order_id: string, // Идентификатор заказа, к которому относится отправление.
  order_number: string, // Номер заказа, к которому относится отправление.
  posting_number: string, // Номер отправления. 
  products: ProductInDeliveryType[], // Список товаров в отправлении.
  status: StatusType // Статус отправления
}

export type PostingFboListResponseType = {
  result: PostingFboListType[]
}