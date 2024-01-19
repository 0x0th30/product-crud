import { Create } from '@use-cases/create/create.business';

export const CreateMock = {
  execute: jest.spyOn(Create.prototype, 'execute'),
};
