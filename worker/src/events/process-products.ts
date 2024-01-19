import { Task } from 'global';
import { RedisClientType } from 'redis';
import { Redis } from '@loaders/redis';
import { ProductRepository } from '@repositories/product';
import { TaskRepository } from '@repositories/task';
import { TaskStatus } from '@prisma/client';
import { logger } from '@utils/logger';

export class ProcessProducts {
  private redisClient: RedisClientType;

  private tasks: any = {};

  private readonly QUEUE = 'products';

  private readonly QUEUE_TIMEOUT = 0;

  constructor(
    private readonly productRepository: ProductRepository,
    private readonly taskRepository: TaskRepository,
    redis: Redis,
  ) {
    this.redisClient = redis.getClient();
  }

  public async execute(): Promise<void> {
    await this.redisClient.blPop(this.QUEUE, this.QUEUE_TIMEOUT)
      .then(async (value) => {
        if (value && value.key === this.QUEUE) {
          const task = JSON.parse(value.element);
          const { taskId } = task;

          this.handleNewTask(task);

          const receivedAllProductsFromTask = await this
            .receivedAllProductsFromTask(taskId);
          if (receivedAllProductsFromTask) {
            let status: TaskStatus = 'STARTED';
            await this.productRepository.createMany(this.tasks[taskId])
              .then(() => { status = 'FINISHED'; })
              .catch(() => { status = 'FAILED'; });

            await this.taskRepository.updateStatus(taskId, status);
            logger.info(`New task "${taskId}" status is "${status}".`);

            this.tasks = {};
          }
        }

        return this.execute();
      });
  }

  private async receivedAllProductsFromTask(taskId: string): Promise<boolean> {
    const productCounter = this.tasks[taskId].length;
    const totalProductsPerTask = await this.taskRepository.readById(taskId)
      .then((data) => data.enqueued)
      .catch(() => this.receivedAllProductsFromTask(taskId));

    return productCounter >= totalProductsPerTask;
  }

  private handleNewTask(task: Task): void {
    const knownTask = Object.keys(this.tasks).find((id) => id === task.taskId);
    if (knownTask) {
      this.tasks[task.taskId].push(
        { code: task.code, title: task.title, price: Number(task.price) },
      );
    } else {
      this.tasks[task.taskId] = [
        { code: task.code, title: task.title, price: Number(task.price) },
      ];
    }
  }
}
