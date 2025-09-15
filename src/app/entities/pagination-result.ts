export type PageableType = {
  page: number;
  size: number;
  sort?: string;
}

export interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface Pagination {
  paged: boolean;
  unpaged: boolean;
  pageNumber: number;
  pageSize: number;
  offset: number;
  sort: Sort;
  filtered: boolean;
}

export interface PageResults<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  number: number;
  size: number;
  numberOfElements: number;
  empty: boolean;
  sort: Sort;
  pageable: Pagination;
}

export type ProcessType = {
  isProcessed: boolean;
}