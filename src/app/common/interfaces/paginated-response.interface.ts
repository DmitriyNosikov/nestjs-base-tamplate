export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
};