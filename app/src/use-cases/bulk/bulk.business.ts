import csvParser from 'csv-parser';
import { v4 } from 'uuid';
import { Request } from 'express';
import { RedisClientType } from 'redis';
import { TaskStatus } from '@prisma/client';
import { TaskRepository } from '@repositories/task';
import { Redis } from '@loaders/redis';
import { FileProcessor } from '@entities/file-processor';
import { logger } from '@utils/logger';
import { BulkDTO } from './bulk.d';

export class Bulk {
  private redisClient: RedisClientType;

  private enqueuedProducts = 0;

  private readonly queue = 'products';

  constructor(
    private readonly repository: TaskRepository,
    private readonly fileProcessor: FileProcessor,
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
    await new Promise(() => {
      this.listenStream(taskId, transaction, request)
        .then((value) => {
          logger.info(`Sending task id "${taskId}" as "${status}" to repository...`);
          this.repository.create(taskId, status, this.enqueuedProducts);

          response.success = true;
          response.data = value as any;
        }).catch((error) => {
          response.success = false;
          response.error = error;
        });
    });

    logger.info('Finishing "bulk" service/use-case.');
    return response;
  }

  private async listenStream(taskId: string, transaction: any, request: Request)
  : Promise<any> {
    return new Promise((resolve, reject) => {
      request.pipe(csvParser())
        .on('data', (row) => {
          this.fileProcessor.onStreamSendData(taskId, transaction, this.queue, row);
          this.enqueuedProducts += 1;
        })
        .on('end', () => {
          this.fileProcessor.onStreamEnds(transaction, taskId)
            .then(() => {
              const task = { taskId, enqueuedProducts: this.enqueuedProducts };
              resolve(task);
            })
            .catch((error) => reject(error));
        });
    });
  }
}
