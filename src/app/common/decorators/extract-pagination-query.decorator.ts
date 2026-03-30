import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { PaginationQueryDTO } from '@core/common/dto/pagination-query.dto';
import { fillDTO } from '@core/libs/helpers';

export const ExtractPaginationQuery = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    const extractedQuery: PaginationQueryDTO = fillDTO(PaginationQueryDTO, query);

    return extractedQuery;
  }
);