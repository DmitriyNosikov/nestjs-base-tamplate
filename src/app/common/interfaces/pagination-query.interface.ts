export interface IPaginationQuery {
  page?: number;
  limit?: number;
  // TODO: Можно заменить на тип конкретно используемой БД
  // например FindOptionsWhere<Model> из typeorm
  where?: Record<string, unknown>;
  order?: Record<string, unknown>;
  returnRelations?: boolean;
}