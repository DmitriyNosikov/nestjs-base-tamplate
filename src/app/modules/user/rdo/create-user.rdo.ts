import { Expose } from 'class-transformer';
import { Cabinet } from 'src/app/models';
export class CreateUserRDO {
  @Expose()
  id!: number;

  @Expose()
  createdAt!: string;

  @Expose()
  updatedAt!: string;

  @Expose()
  fullName!: string;

  @Expose()
  login!: string;

  @Expose()
  role!: string;

  @Expose()
  companyId!: Cabinet[];
  
  @Expose()
  cabinets!: Cabinet[];
}