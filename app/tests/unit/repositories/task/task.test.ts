import { NotFoundItem, NotUniqueId } from '@errors/repository-error';
import { TaskStatus } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { TaskRepository } from '@repositories/task';
import { PrismaMock } from '@tests/unit/mocks/prisma.mock';

const TaskRepositorySUT = new TaskRepository(PrismaMock as any);

describe('TaskRepository class', () => {
  describe('(public) create method', () => {
    it('should call "task.create"', () => {
      const id = 'asdf';
      const status = 'STARTED';
      const enqueued = 5;

      PrismaMock.task.create.mockResolvedValueOnce(null as any);

      TaskRepositorySUT.create(id, status, enqueued);

      expect(PrismaMock.task.create).toHaveBeenCalled();
    });
    it('should call "task.create" w/ received parameter', () => {
      const id = 'asdf';
      const status = 'STARTED';
      const enqueued = 5;

      PrismaMock.task.create.mockResolvedValueOnce(null as any);

      TaskRepositorySUT.create(id, status, enqueued);
      const expectedParameters = { data: { id, status, enqueued } };

      expect(PrismaMock.task.create).toHaveBeenCalledWith(expectedParameters);
    });
    it('should throw "NotUniqueId" if error code is "P2002"', () => {
      const id = 'asdf';
      const status = 'STARTED';
      const enqueued = 5;

      PrismaMock.task.create.mockRejectedValueOnce(
        new PrismaClientKnownRequestError('foo', { code: 'P2002', clientVersion: '0' }),
      );

      TaskRepositorySUT.create(id, status, enqueued).catch((error) => {
        expect(error).toBeInstanceOf(NotUniqueId);
      });
    });
    it('should return created task', () => {
      const id = 'asdf';
      const status = 'STARTED';
      const enqueued = 5;
      const createdAt = new Date('2024-01-19T06:03:33.706Z');
      const updatedAt = new Date('2024-01-19T06:03:33.706Z');

      PrismaMock.task.create.mockResolvedValueOnce({
        id,
        status,
        enqueued,
        created_at: createdAt,
        updated_at: updatedAt,
      });

      TaskRepositorySUT.create(id, status, enqueued)
        .then((task) => {
          expect(task.id).toEqual(id);
          expect(task.status).toEqual(status);
          expect(task.enqueued).toEqual(enqueued);
          expect(task.created_at).toEqual(createdAt);
          expect(task.updated_at).toEqual(updatedAt);
        });
    });
  });
  describe('(public) readById method', () => {
    it('should call "task.findFirst"', () => {
      const id = 'asdf';

      PrismaMock.task.findFirst.mockResolvedValueOnce({} as any);

      TaskRepositorySUT.readById(id);

      expect(PrismaMock.task.findFirst).toHaveBeenCalled();
    });
    it('should call "task.findFirst" w/ provided code', () => {
      const id = 'asdf';

      PrismaMock.task.findFirst.mockResolvedValueOnce({} as any);

      TaskRepositorySUT.readById(id);
      const expectedParameters = { where: { id } };

      expect(PrismaMock.task.findFirst).toHaveBeenCalledWith(expectedParameters);
    });
    it('should throw "NotFoundItem" if cannot found task', () => {
      const id = 'asdf';

      PrismaMock.task.findFirst.mockResolvedValueOnce(null);

      TaskRepositorySUT.readById(id).catch((error) => {
        expect(error).toBeInstanceOf(NotFoundItem);
      });
    });
    it('should return found task', () => {
      const id = 'asdf';

      const expectedtask = {
        id: 'asdf',
        status: 'STARTED' as TaskStatus,
        enqueued: 5,
        created_at: new Date('2024-01-19T06:03:33.706Z'),
        updated_at: new Date('2024-01-19T06:03:33.706Z'),
      };
      PrismaMock.task.findFirst.mockResolvedValueOnce(expectedtask);

      TaskRepositorySUT.readById(id).then((task) => {
        expect(task).toEqual(expectedtask);
      });
    });
  });
  describe('(public) updateStatus method', () => {
    it('should call "task.update"', () => {
      const id = 'asdf';
      const status = 'FINISHED';

      PrismaMock.task.update.mockResolvedValueOnce(null as any);

      TaskRepositorySUT.updateStatus(id, status);

      expect(PrismaMock.task.update).toHaveBeenCalled();
    });
    it('should call "task.update" w/ provided parameter', () => {
      const id = 'asdf';
      const status = 'FINISHED';

      PrismaMock.task.update.mockResolvedValueOnce(null as any);

      TaskRepositorySUT.updateStatus(id, status);
      const where = { id };
      const data = { status };
      const expectedParameters = { where, data };

      expect(PrismaMock.task.update).toHaveBeenCalledWith(expectedParameters);
    });
    it('should return updated task', () => {
      const id = 'asdf';
      const status = 'FINISHED';

      const expectedtask = {
        id: 'asdf',
        status: 'FINISHED' as TaskStatus,
        enqueued: 10,
        created_at: new Date('2024-01-19T06:03:33.706Z'),
        updated_at: new Date('2024-01-19T06:03:33.706Z'),
      };
      PrismaMock.task.update.mockResolvedValueOnce(expectedtask);

      TaskRepositorySUT.updateStatus(id, status).then((task) => {
        expect(task).toEqual(expectedtask);
      });
    });
  });
});
