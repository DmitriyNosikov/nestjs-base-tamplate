import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { TransformValueToBoolean } from '../decorators/transform-value-to-boolean.decorator';
import { TransformValueToNumber } from '../decorators/transform-value-to-number.decorator';
import { SortDirectionTypeEnum } from '../types';
import { SortDirectionType } from '../types/sort-direction.type';

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

// Базовый DTO для пагинации
export class PaginationQueryDTO {
  @IsOptional()
  @IsNumber()
  @Min(PaginationLimits.PAGE.MIN)
  @ApiProperty({
    description: 'Номер страницы',
    type: Number,
    example: 1,
    minimum: PaginationLimits.PAGE.MIN,
    required: false
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
    example: 10,
    minimum: PaginationLimits.LIMIT.MIN,
    maximum: PaginationLimits.LIMIT.MAX,
    required: false
  })
  @TransformValueToNumber()
  limit?: number;

  @ApiProperty({
    description: 'Поле сортировки',
    type: String,
    example: 'login',
    required: false
  })
  sortBy?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Направление сортировки',
    type: String,
    enum: SortDirectionTypeEnum,
    example: SortDirectionTypeEnum.DESC,
    required: false
  })
  sortDirection: SortDirectionType;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Возвращать ли связанные данные',
    type: Boolean,
    example: true,
    required: false
  })
  @TransformValueToBoolean()
  returnRelations?: boolean;
}