import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsObject, IsOptional, Max, Min } from 'class-validator';
import { TransformValueToBoolean } from '../decorators/transform-value-to-boolean.decorator';
import { TransformValueToNumber } from '../decorators/tranfsorm-value-to-number.decorator';
import { IPaginationQuery } from '../interfaces/pagination-query.interface';

export const PaginationLimits = {
  LIMIT: {
    MIN: 1,
    MAX: 10
  },
  PAGE: {
    MIN: 1,
    MAX: 100
  }
};

export class PaginationQueryDTO implements IPaginationQuery {
  @IsOptional()
  @IsNumber()
  @Min(PaginationLimits.PAGE.MIN)
  @ApiProperty({
    description: 'Номер страницы',
    type: Number,
    example: 1
  })
  @TransformValueToNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(PaginationLimits.LIMIT.MIN)
  @Max(PaginationLimits.LIMIT.MAX)
  @ApiProperty({
    description: 'Количество элементов на странице',
    type: Number,
    example: 10
  })
  @TransformValueToNumber()
  limit?: number;

  @IsOptional()
  @IsObject()
  @ApiProperty({
    description: 'Условие фильтрации',
    type: Object,
    example: { login: 'User Login' }
  })
  where?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  @ApiProperty({
    description: 'Сортировка',
    type: Object,
    example: { createdAt: 'DESC' }
  })
  order?: Record<string, unknown>;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Возвращать ли связанные данные',
    type: Boolean,
    example: true
  })
  @TransformValueToBoolean()
  returnRelations?: boolean;
}