import { TaskStatus } from '@prisma/client';
import { TaskRepository } from '@repositories/task';
import { TaskRepositoryMock } from '@tests/unit/repositories/task/task.mock';
import { CheckTaskStatus } from '@use-cases/check-task-status/check-task-status.business';

const CheckTaskStatusSUT = new CheckTaskStatus(
  TaskRepositoryMock as any as TaskRepository,
);

describe('CheckTaskStatus class', () => {
  describe('(public) execute method', () => {
    it('should call "taskRepository.readById" method', () => {
      const id = 'asdf';

      TaskRepositoryMock.readById.mockResolvedValueOnce(null as any);

      CheckTaskStatusSUT.execute(id);

      expect(TaskRepositoryMock.readById).toHaveBeenCalled();
    });
    it('should call "taskRepository.readById" method w/ provided parameters', () => {
      const id = 'asdf';

      TaskRepositoryMock.readById.mockResolvedValueOnce(null as any);

      CheckTaskStatusSUT.execute(id);

      expect(TaskRepositoryMock.readById).toHaveBeenCalledWith(id);
    });
    it('should return success DTO in case of success', () => {
      const id = 'asdf';

      const task = {
        id: 'asdf',
        status: 'STARTED' as TaskStatus,
        enqueued: 10,
        created_at: new Date('2024-01-19T06:03:33.706Z'),
        updated_at: new Date('2024-01-19T06:03:33.706Z'),
      };
      const expectedResponse = {
        success: true,
        data: { task },
      };

      TaskRepositoryMock.readById.mockResolvedValueOnce(task);

      CheckTaskStatusSUT.execute(id).then((response) => {
        expect(response).toEqual(expectedResponse);
      });
    });
    it('should return failed DTO in case of fail', () => {
      const id = 'asdf';

      const error = new Error();
      const expectedResponse = {
        success: false,
        error,
      };

      TaskRepositoryMock.readById.mockRejectedValueOnce(error);

      CheckTaskStatusSUT.execute(id).then((response) => {
        expect(response).toEqual(expectedResponse);
      });
    });
  });
});
