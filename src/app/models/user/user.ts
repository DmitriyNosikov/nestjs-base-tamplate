import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes
} from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';
import { UserRolesType, UserRolesTypeEnum } from 'src/app/modules/libs';

export interface UserModelI extends Model<
  InferAttributes<UserModelI>,
  InferCreationAttributes<UserModelI>
> {
  id: CreationOptional<number>;
  fullName: string;

  login: string;
  password: string;
  role: UserRolesType,
}

@Table
export class User extends Model<UserModelI> {
  @Column({
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id: CreationOptional<number>;

  @Column({ type: DataTypes.STRING, allowNull: false })
  fullName: string;


  @Column({ type: DataTypes.STRING, allowNull: false })
  login: string;


  @Column({ type: DataTypes.STRING, allowNull: false })
  password: string;


  @Column({ type: DataTypes.STRING, defaultValue: UserRolesTypeEnum.USER })
  role: string;
}