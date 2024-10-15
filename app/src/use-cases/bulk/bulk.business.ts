import csvParser from 'csv-parser';
import { v4 } from 'uuid';
import { Request } from 'express';
import { RedisClientType } from 'redis';
import { TaskStatus } from '@prisma/client';
import { TaskRepository } from '@repositories/task';
import { Redis } from '@loaders/redis';
import { logger } from '@utils/logger';
import { BulkDTO } from './bulk.d';

export class Bulk {
  private redisClient: RedisClientType;

  private enqueuedProducts = 0;

  private readonly QUEUE = 'products';

  constructor(
    private readonly task: TaskRepository,
    redis: Redis,
  ) {
    this.redisClient = redis.getClient();
  }

  public async execute(request: Request): Promise<BulkDTO> {
    logger.info('Initializing "bulk" service/use-case...');
    const response: BulkDTO = { success: false };

    logger.info('Setting transactions identities and status...');
    const taskId = v4();
    const status: TaskStatus = 'STARTED';

    logger.info(`Creating transaction under id "${taskId}"`);
    const transaction = this.redisClient.multi();

    logger.info('Reading stream from request...');
    await new Promise((resolve, reject) => {
      request.pipe(csvParser())
        .on('data', (row) => {
          const rowKeys = Object.keys(row);
          if (rowKeys.length === 4) {
            const handledRow = {
              taskId,
              code: row[rowKeys[0]],
              name: row[rowKeys[1]],
              price: row[rowKeys[2]],
              quantity: row[rowKeys[3]],
            };

            logger.info(`Pushing "${JSON.stringify(handledRow)}" to queue...`);

            transaction.rPush(this.QUEUE, JSON.stringify(handledRow));
            this.enqueuedProducts += 1;
          }
        })
        .on('end', () => {
          logger.info('Finish to read stream. Commiting transaction...');
          transaction.exec()
            .then(() => {
              logger.info('The transaction was successfully commited under task id'
                + `"${taskId}" w/ ${this.enqueuedProducts} enqueued products`);

              const data = { taskId, enqueuedProducts: this.enqueuedProducts };
              resolve(data);
            })
            .catch((error) => {
              logger.error('Something went wrong during commiting transaction!'
                + ` Details: ${error}`);

              transaction.discard();
              reject(error);
            });
        });
    }).then((value) => {
      response.success = true;
      response.data = value as any;
    }).catch((error) => {
      response.success = false;
      response.error = error;
    });

    if (response.success) {
      logger.info(`Sending task id "${taskId}" as "${status}" to task repository...`);
      await this.task.create(taskId, status, this.enqueuedProducts);
    }

    this.enqueuedProducts = 0;

    logger.info('Finishing "bulk" service/use-case.');
    return response;
  }
}
