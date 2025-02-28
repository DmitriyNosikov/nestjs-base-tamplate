import { Expose } from 'class-transformer';
export class CreateUserRDO {
  @Expose()
  id!: number;

  @Expose()
  createdAt!: string;

  @Expose()
  updatedAt!: string;

  @Expose()
  login!: string;

  @Expose()
  role!: string;
}