import { IUserModel } from '@core/models';
import { Order, WhereOptions } from 'sequelize';

export type UserPaginationOptionsType = {
  where: WhereOptions<IUserModel>;
  order: Order;
  limit: number;
  offset: number;
}