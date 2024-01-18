import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { TaskRepository } from '@repositories/task';
import { NotFoundItem } from '@errors/repository-error';
import { CheckTaskStatus } from './check-task-status.business';
import { CheckTaskStatusHTTPResponse } from './check-task-status.d';

const CheckTaskStatusBusiness = new CheckTaskStatus(
  new TaskRepository(
    new PrismaClient(),
  ),
);

export class CheckTaskStatusMiddleware {
  public async handle(request: Request, response: Response): Promise<Response> {
    const responseContent: CheckTaskStatusHTTPResponse = { success: false };

    const { id } = request.params;

    const checkTaskStatus = await CheckTaskStatusBusiness.execute(id);

    if (checkTaskStatus.success && checkTaskStatus.data) {
      responseContent.success = true;
      responseContent.data = checkTaskStatus.data;
      return response.status(200).json(responseContent);
    }

    if (checkTaskStatus.error instanceof NotFoundItem) {
      responseContent.success = false;
      responseContent.message = `Cannot found task with id "${id}"!`;
      return response.status(404).json(responseContent);
    }

    responseContent.success = false;
    responseContent.message = 'Failed by internal/unknown reasons, report this issue!';
    return response.status(500).json(responseContent);
  }
}
