import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

export interface IRefreshTokenModel extends Model<
  InferAttributes<IRefreshTokenModel>,
  InferCreationAttributes<IRefreshTokenModel>
> {
  id?: CreationOptional<number>;
  tokenId: string;
  expiresIn: Date
}

@Table({ modelName: 'RefreshTokens' })
export class RefreshToken extends Model<IRefreshTokenModel> {
  @Column({
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id?: CreationOptional<number>;

  @Column({ type: DataType.STRING, allowNull: false })
  tokenId: string;

  @Column({ type: DataType.DATE, allowNull: false })
  expiresIn: Date;
}