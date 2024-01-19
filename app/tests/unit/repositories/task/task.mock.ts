import { TaskRepository } from '@repositories/task';

export const TaskRepositoryMock = {
  create: jest.spyOn(TaskRepository.prototype, 'create'),
  readById: jest.spyOn(TaskRepository.prototype, 'readById'),
  updateStatus: jest.spyOn(TaskRepository.prototype, 'updateStatus'),
};
