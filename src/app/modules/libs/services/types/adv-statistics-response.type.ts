export type AdvStatisticsTaskResponseType = {
  UUID: string, // Уникальный идентификатор отправленного запроса.
  vendor: boolean // Если запрашивается отчёт с аналитикой внешнего трафика — true
}

type AdvStatisticsReportItemRowType = {
  date: string,
  search_query: string,
  views: string,
  clicks: string,
  ctr: string,
  moneySpent: string,
  avgBid: string,
  orders: string,
  ordersMoney: string,
  models: string,
  modelsMoney: string,
  sku: string,
  title: string,
  price: string,
  toCart: string
}

type AdvStatisticsReportItemTotalType = {
  search_query: string,
  views: string,
  clicks: string,
  ctr: string,
  moneySpent: string,
  avgBid: string,
  orders: string,
  ordersMoney: string,
  models: string,
  modelsMoney: string,
  toCart: string,
  corrections: string
}

type AdvStatisticsReportItemType = {
  title: string, // Кампания по продвижению товаров № 11908011, период 01.09.2024-01.11.2024
  report: {
    rows: AdvStatisticsReportItemRowType[],
    totals: AdvStatisticsReportItemTotalType
  }
}

export type AdvStatisticsReportJSONResponseType = Record<string, AdvStatisticsReportItemType>;