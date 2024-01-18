import csvParser from 'csv-parser';
import { v4 } from 'uuid';
import { Request } from 'express';
import { TaskStatus } from '@prisma/client';
import { TaskRepository } from '@repositories/task';
import { redis } from '@loaders/redis';
import { logger } from '@utils/logger';
import { BulkDTO } from './bulk.d';

export class Bulk {
  constructor(
    private readonly repository: TaskRepository,
  ) {}

  public async execute(request: Request): Promise<BulkDTO> {
    logger.info('Initializing "bulk" service/use-case...');
    const response: BulkDTO = { success: false };

    logger.info('Setting transactions identities and status...');
    let enqueuedProducts = 0;
    const id = v4();
    const status: TaskStatus = 'STARTED';

    logger.info(`Creating transaction under id "${id}"`);
    const transaction = redis.multi();

    logger.info('Reading stream from request...');
    request.pipe(csvParser())
      .on('data', (row) => {
        const keys = Object.keys(row);
        if (keys.length === 3) {
          const handledRow = {
            id: row[keys[0]], title: row[keys[1]], price: row[keys[2]],
          };

          logger.info(`Pushing "${JSON.stringify(handledRow)}" to queue...`);

          transaction.rPush(id, JSON.stringify(handledRow));
          enqueuedProducts += 1;
        }
      })
      .on('end', () => {
        logger.info('Finish to read stream. Commiting transaction...');
        transaction.exec()
          .then(() => {
            logger.info(`The transaction was successfully commited under task id "${id}"`
            + ` w/ ${enqueuedProducts} enqueued products`);

            response.success = true;
            response.data = { taskId: id, enqueuedProducts };
          })
          .catch((error) => {
            logger.error('Something went wrong during commiting transaction!'
            + ` Details: ${error}`);

            response.success = false;
            response.error = error;
            transaction.discard();
          });
      });

    if (response.success) {
      logger.info(`Sending task id "${id}" as "${status}" to repository...`);
      await this.repository.create(id, status);
    }

    logger.info('Finishing "bulk" service/use-case.');
    return response;
  }
}
