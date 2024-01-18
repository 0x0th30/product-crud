export type PaginationParameters = {
  page: number,
  limit: number,
};

export type SearchParameters = {
  pagination: PaginationParameters,
  keyword: string,
};

export type Task = {
  operationId: number,
  code: string,
  title: string,
  price: number,
};
