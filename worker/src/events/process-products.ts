import { RedisClientType } from 'redis';
import { Redis } from '@loaders/redis';
import { ProductRepository } from '@repositories/product';
import { TaskRepository } from '@repositories/task';
import { logger } from '@utils/logger';
import { TaskStatus } from '@prisma/client';

const operations = {} as any;

export class ProcessProducts {
  private redisClient: RedisClientType;

  constructor(
    private readonly product: ProductRepository,
    private readonly task: TaskRepository,
    redis: Redis,
  ) {
    this.redisClient = redis.getClient();
  }

  public async execute(): Promise<void> {
    logger.info('Initializing "process-product" event handler...');
    const queue = 'products';
    const timeout = 0;

    logger.info(`Listening "${queue}" queue...`);
    this.redisClient.blPop(queue, timeout)
      .then(async (value) => {
        if (value && value.key === queue) {
          logger.info(`Received new task in queue "${queue}"...`);
          const task = JSON.parse(value.element);
          const { operationId } = task;

          logger.info(`Processing task from operation id "${operationId}"...`);
          const exists = Object.keys(operations).find((id) => id === operationId);
          if (exists) {
            operations[operationId].push(
              { code: task.code, title: task.title, price: Number(task.price) },
            );
          } else {
            operations[operationId] = [
              { code: task.code, title: task.title, price: Number(task.price) },
            ];
          }

          const productCounter = operations[operationId].length;
          const totalProductsPerTask = await this.task.readById(operationId)
            .then((data) => data.enqueued);

          if (productCounter >= totalProductsPerTask) {
            let status: TaskStatus = 'STARTED';
            await this.product.createMany(operations[operationId])
              .then(() => {
                logger.info(`${productCounter}/${totalProductsPerTask} added products`
                + ` from operation "${operationId}"...`);

                status = 'FINISHED';
              })
              .catch(() => { status = 'FAILED'; });

            await this.task.updateStatus(operationId, status);
            logger.info(`New operation "${operationId}" status is "${status}".`);
          }
        }

        return this.execute();
      });
  }
}
