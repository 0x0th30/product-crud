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

  constructor(
    private readonly repository: TaskRepository,
    redis: Redis,
  ) {
    this.redisClient = redis.getClient();
  }

  public async execute(request: Request): Promise<BulkDTO> {
    logger.info('Initializing "bulk" service/use-case...');
    const response: BulkDTO = { success: false };

    logger.info('Setting transactions identities and status...');
    let enqueuedProducts = 0;
    const id = v4();
    const queue = 'products';
    const status: TaskStatus = 'STARTED';

    logger.info(`Creating transaction under id "${id}"`);
    const transaction = this.redisClient.multi();

    logger.info('Reading stream from request...');
    await new Promise((resolve, reject) => {
      request.pipe(csvParser())
        .on('data', (row) => {
          const keys = Object.keys(row);
          if (keys.length === 3) {
            const task = {
              operationId: id,
              code: row[keys[0]],
              title: row[keys[1]],
              price: row[keys[2]],
            };

            logger.info(`Pushing "${JSON.stringify(task)}" to queue...`);

            transaction.rPush(queue, JSON.stringify(task));
            enqueuedProducts += 1;
          }
        })
        .on('end', () => {
          logger.info('Finish to read stream. Commiting transaction...');
          transaction.exec()
            .then(() => {
              logger.info('The transaction was successfully commited under task id'
              + `"${id}" w/ ${enqueuedProducts} enqueued products`);

              const data = { taskId: id, enqueuedProducts };
              resolve(data);
            })
            .catch(async (error) => {
              logger.error('Something went wrong during commiting transaction!'
              + ` Details: ${error}`);

              const newStatus = 'FAILED';
              await this.repository.updateStatus(id, newStatus);

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
      logger.info(`Sending task id "${id}" as "${status}" to repository...`);
      await this.repository.create(id, status, enqueuedProducts);
    }

    logger.info('Finishing "bulk" service/use-case.');
    return response;
  }
}
