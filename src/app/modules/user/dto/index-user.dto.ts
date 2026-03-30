import { PaginationQueryDTO } from '@core/common/dto/pagination-query.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class IndexUserDTO extends PaginationQueryDTO {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'ID пользователя',
    type: Number,
    example: 1,
    required: false
  })
  id?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Логин пользователя',
    type: String,
    example: 'admin',
    required: false
  })
  login?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'Дата создания пользователя',
    type: Date,
    example: '2021-01-01',
    required: false
  })
  createdAt?: Date;
}