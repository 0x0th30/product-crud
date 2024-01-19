import { Update } from '@use-cases/update/update.business';

export const UpdateMock = {
  execute: jest.spyOn(Update.prototype, 'execute'),
};
