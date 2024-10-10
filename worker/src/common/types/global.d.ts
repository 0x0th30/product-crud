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
  name: string,
  price: number,
  quantity: number,
}

export type Task = {
  taskId: string,
  code: string,
  name: string,
  price: number,
  quantity: number,
};
