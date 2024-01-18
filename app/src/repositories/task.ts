import { PrismaClient, Task, TaskStatus } from '@prisma/client';
import { NotFoundItem, NotUniqueId } from '@errors/repository-error';

export class TaskRepository {
  constructor(
    private readonly client: PrismaClient,
  ) {}

  public async create(id: string, status: TaskStatus, enqueued: number): Promise<Task> {
    const data = { id, status, enqueued };

    const task = await this.client.task.create({ data })
      .catch((error) => {
        if (error.code === 'P2002') throw new NotUniqueId(id);
        throw error;
      });

    return task;
  }

  public async readById(id: string): Promise<Task> {
    const where = { id };

    const task = await this.client.task.findFirst({ where });
    if (!task) throw new NotFoundItem(id);

    return task;
  }

  public async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    const where = { id };
    const data = { status };

    const task = await this.client.task.update({ where, data });

    return task;
  }
}
