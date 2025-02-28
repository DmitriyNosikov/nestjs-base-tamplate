import {
  TransactionOperationItemPostingType,
  TransactionOperationItemsType,
  TransactionOperationServiceType,
  TransactionOperationTypeType
} from 'src/app/models';

type FinanceTransactionType = {
  accruals_for_sale: number, // Стоимость товаров с учётом скидок продавца.
  amount: number, // Итоговая сумма операции
  delivery_charge: number, // Стоимость доставки для начислений по тарифам, которые действовали до 1 февраля 2021 года, а также начислений для крупногабаритных товаров.
  items: TransactionOperationItemsType[], // Информация о товаре.
  operation_date: Date, // Дата операции.
  operation_id: number, // Идентификатор операции.
  operation_type: string, // Тип операции.
  operation_type_name: string, // Название типа операции.
  posting: TransactionOperationItemPostingType, // 
  // Плата за возвраты и отмены для начислений по тарифам, которые 
  // действовали до 1 февраля 2021 года, а также начислений для крупногабаритных товаров.
  return_delivery_charge: number,
  sale_commission: number, // Комиссия за продажу или возврат комиссии за продажу
  services: TransactionOperationServiceType[], // Название услуги.
  type: TransactionOperationTypeType, // Тип начисления
}

export type FinanceTransactionResponseType = {
  result: {
    operations: FinanceTransactionType[],
    page_count: number,
    row_count: number
  }
}