import { Type } from 'class-transformer';

export type PaginationOptionsType<
  W = Record<string, unknown>,
  O = Record<string, unknown>
> = {
  page?: number;
  limit?: number;
  where?: W;
  order?: O;
  returnRelations?: boolean;
}