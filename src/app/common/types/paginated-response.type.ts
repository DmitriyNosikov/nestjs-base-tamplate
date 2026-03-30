export type PaginatedResponseType<T> = {
  data: T[];
  total: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
};