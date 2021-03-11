export class PaginatedList<T> {
  items: T[];

  hasPreviousPage: boolean;

  hasNextPage: boolean;

  pageIndex: number;

  totalItems: number;

  pageSize: number;

  totalPages: number;

  constructor(
    items: T[],
    pageIndex: number,
    pageSize: number,
    totalItems: number,
  ) {
    this.items = items;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.totalItems = totalItems;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.hasNextPage = this.pageIndex < this.totalPages;
    this.hasPreviousPage = this.pageIndex > 1;
  }
}
