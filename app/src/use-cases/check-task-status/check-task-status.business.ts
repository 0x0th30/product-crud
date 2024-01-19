import { TaskRepository } from '@repositories/task';
import { logger } from '@utils/logger';
import { CheckTaskStatusDTO } from './check-task-status.d';

export class CheckTaskStatus {
  constructor(
    private readonly taskRepository: TaskRepository,
  ) {}

  public async execute(id: string): Promise<CheckTaskStatusDTO> {
    logger.info('Initializing "check-task-status" service/use-case...');
    const response: CheckTaskStatusDTO = { success: false };

    logger.info('Sending a read by id request to repository...');
    await this.taskRepository.readById(id)
      .then((task) => {
        logger.info('Received task from repository.');
        response.success = true;
        response.data = { task };
      })
      .catch((error) => {
        logger.error(`Received an error from repository. Details: ${error}`);
        response.success = false;
        response.error = error;
      });

    logger.info('Finishing "check-task-status" service/use-case.');
    return response;
  }
}
