import { TaskRepository } from '@repositories/task';
import { logger } from '@utils/logger';

export class FileProcessor {
  constructor(
    private readonly repository: TaskRepository,
  ) {}

  public async onStreamSendData(
    taskId: string,
    transaction: any,
    queue: string,
    row: any,
  ): Promise<void> {
    const parsedRow = this.parseRowFromStream(row);
    const task = { taskId, ...parsedRow };

    logger.info(`Pushing "${JSON.stringify(task)}" to queue...`);

    transaction.rPush(queue, JSON.stringify(task));
  }

  public async onStreamEnds(transaction: any, operationId: string): Promise<void> {
    transaction.exec()
      .catch(async (error: any) => {
        const newStatus = 'FAILED';
        await this.repository.updateStatus(operationId, newStatus);

        transaction.discard();
        throw error;
      });
  }

  private parseRowFromStream(row: any) {
    const keys = Object.keys(row);
    if (keys.length === 3) {
      const parsedRow = {
        code: row[keys[0]],
        title: row[keys[1]],
        price: row[keys[2]],
      };

      return parsedRow;
    }

    return false;
  }
}
