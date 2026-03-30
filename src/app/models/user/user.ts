import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes
} from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';

import { UserRolesType, UserRolesTypeEnum } from '@core/common/types';

export interface IUserModel extends Model<
  InferAttributes<IUserModel>,
  InferCreationAttributes<IUserModel>
> {
  id: CreationOptional<number>;

  login: string;
  password: string;
  role: UserRolesType,
}

@Table
export class User extends Model<IUserModel> {
  @Column({
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id: CreationOptional<number>;

  @Column({ type: DataTypes.STRING, allowNull: false })
  login: string;


  @Column({ type: DataTypes.STRING, allowNull: false })
  password: string;


  @Column({ type: DataTypes.STRING, defaultValue: UserRolesTypeEnum.USER })
  role: string;
}