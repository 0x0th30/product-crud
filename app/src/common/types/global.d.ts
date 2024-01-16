export type PaginationParameters = {
  page: number,
  limit: number,
};

export type SearchParameters = {
  pagination: PaginationParameters,
  keyword: string,
};
