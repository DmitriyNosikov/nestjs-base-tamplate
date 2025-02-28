import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

export interface RefreshTokenModelI extends Model<
  InferAttributes<RefreshTokenModelI>,
  InferCreationAttributes<RefreshTokenModelI>
> {
  id?: CreationOptional<number>;
  tokenId: string;
  expiresIn: Date
}

@Table({ modelName: 'RefreshTokens' })
export class RefreshToken extends Model<RefreshTokenModelI> {
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