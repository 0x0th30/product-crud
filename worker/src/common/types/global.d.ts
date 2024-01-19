export type PaginationParameters = {
  page: number,
  limit: number,
};

export type SearchParameters = {
  pagination: PaginationParameters,
  keyword: string,
};

export type Product = {
  code: string,
  title: string,
  price: number,
}

export type Task = {
  taskId: string,
  code: string,
  title: string,
  price: number,
};
