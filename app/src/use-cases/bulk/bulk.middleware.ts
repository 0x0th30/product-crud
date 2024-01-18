import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { TaskRepository } from '@repositories/task';
import { Redis } from '@loaders/redis';
import { Bulk } from './bulk.business';
import { BulkHTTPResponse } from './bulk.d';

const BulkBusiness = new Bulk(
  new TaskRepository(
    new PrismaClient(),
  ),
  new Redis(),
);

export class BulkMiddleware {
  public async handle(request: Request, response: Response): Promise<Response> {
    const responseContent: BulkHTTPResponse = { success: false };

    const bulk = await BulkBusiness.execute(request);

    if (bulk.success && bulk.data) {
      responseContent.success = true;
      responseContent.data = bulk.data;
      return response.status(202).json(responseContent);
    }

    responseContent.success = false;
    responseContent.message = 'Failed by internal/unknown reasons, report this issue!';
    return response.status(500).json(responseContent);
  }
}
