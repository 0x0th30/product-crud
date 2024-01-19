import { ReadBySearch } from '@use-cases/read-by-search/read-by-search.business';

export const ReadBySearchMock = {
  execute: jest.spyOn(ReadBySearch.prototype, 'execute'),
};
