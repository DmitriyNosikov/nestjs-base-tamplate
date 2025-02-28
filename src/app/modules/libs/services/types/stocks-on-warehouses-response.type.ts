type StockOnWarehousesType = {
    // https://docs.ozon.ru/api/seller/#operation/AnalyticsAPI_AnalyticsGetStockOnWarehousesV2
    sku: string; // Идентификатор товара в системе Ozon — SKU.
    item_code: string; // Идентификатор товара в системе продавца (Артикул)
    item_name: string; // Название товара в системе Ozon. (Название склада)
    free_to_sell_amount: number; // Количество товара, доступное к продаже на Ozon. (Доступный к продаже товар)
    promised_amount: number; // Количество товара, указанное в подтверждённых будущих поставках.
    reserved_amount: number; // Количество товара, зарезервированное для покупки, возврата и перевозки между складами. (Резерв)
    warehouse_name: string; // Название склада, где находится товар.
    idc: number; // На сколько дней хватит остатка товара с учётом среднесуточных продаж.
}

export type StockOnWarehousesResponseType = {
  result: {
    rows: StockOnWarehousesType[]
  }
}