import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { TaskRepository } from '@repositories/task';
import { Bulk } from './bulk.business';
import { BulkHTTPResponse } from './bulk.d';

const BulkBusiness = new Bulk(
  new TaskRepository(
    new PrismaClient(),
  ),
);

export class BulkMiddleware {
  public async handle(request: Request, response: Response): Promise<Response> {
    const responseContent: BulkHTTPResponse = { success: false };

    const create = await BulkBusiness.execute(request);

    if (create.success && create.data) {
      responseContent.success = true;
      responseContent.data = create.data;
      return response.status(201).json(responseContent);
    }

    responseContent.success = false;
    responseContent.message = 'Failed by internal/unknown reasons, report this issue!';
    return response.status(500).json(responseContent);
  }
}
