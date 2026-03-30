import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/common';
import { Expose } from 'class-transformer';

import { IPaginatedResponse } from '@common/interfaces';

/*
  Т.к Swagger для построения документации необходимо
  значение, которое существует в рантайме, то мы не можем использовать
  интерфейс IPaginatedResponse или передавать в класс тип <T> напрямую,
  так как он существует только до стадии компиляции.
  Поэтому мы используем фабрику PaginatedResponseSwaggerRDO, которая
  возвращает нужный нам класс с уже установленным типом data<T>
*/
export function PaginationResponseSwaggerRDO<T>(
  itemType: Type<T>,
): Type<IPaginatedResponse<T>> {
  class PaginatedResponse implements IPaginatedResponse<T> {
    @Expose()
    @ApiProperty({ type: () => itemType, isArray: true })
    data!: T[];

    @Expose()
    @ApiProperty({ type: Number })
    total!: number;

    @Expose()
    @ApiProperty({ type: Number })
    totalPages!: number;

    @Expose()
    @ApiProperty({ type: Number })
    currentPage!: number;

    @Expose()
    @ApiProperty({ type: Number })
    itemsPerPage!: number;
  }

  // Nest Swagger использует имя класса как ключ схемы.
  // В фабрике иначе получится несколько разных схем с одинаковым именем "PaginatedResponse".
  Object.defineProperty(PaginatedResponse, 'name', {
    value: `PaginatedResponseOf${itemType?.name ?? 'Unknown'}`,
  });

  return PaginatedResponse;
}