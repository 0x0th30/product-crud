import { ReadByCode } from '@use-cases/read-by-code/read-by-code.business';

export const ReadByCodeMock = {
  execute: jest.spyOn(ReadByCode.prototype, 'execute'),
};
