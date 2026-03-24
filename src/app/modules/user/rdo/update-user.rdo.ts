import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
export class UpdateUserRDO {
  @Expose()
  @ApiProperty({
    description: 'ID пользователя',
    type: Number,
    example: 1
  })
  id!: number;

  @Expose()
  @ApiProperty({
    description: 'Дата создания пользователя',
    type: String,
    example: '2021-01-01'
  })
  createdAt!: string;

  @Expose()
  @ApiProperty({
    description: 'Дата изменения данных пользователя',
    type: String,
    example: '2021-01-01'
  })
  updatedAt!: string;

  @Expose()
  @ApiProperty({
    description: 'Логин пользователя',
    type: String,
    example: 'admin'
  })
  login!: string;

  @Expose()
  @ApiProperty({
    description: 'Роль пользователя',
    type: String,
    example: 'USER'
  })
  role!: string;
}