import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ProductRepository } from '@repositories/product';
import { NotFoundProduct } from '@errors/product-error';
import { ReadByCode } from './read-by-code.business';
import { ReadByCodeHTTPResponse } from './read-by-code.d';

const ReadByCodeBusiness = new ReadByCode(
  new ProductRepository(
    new PrismaClient(),
  ),
);

export class ReadByCodeMiddleware {
  public async handle(request: Request, response: Response): Promise<Response> {
    const responseContent: ReadByCodeHTTPResponse = { success: false };

    const code = String(request.params['code']);

    const read = await ReadByCodeBusiness.execute(code);

    if (read.success && read.data) {
      responseContent.success = true;
      responseContent.data = read.data;
      return response.status(200).json(responseContent);
    }

    if (read.error instanceof NotFoundProduct) {
      responseContent.success = false;
      responseContent.message = `Cannot found product with code "${code}"!`;
      return response.status(404).json(responseContent);
    }

    responseContent.success = false;
    responseContent.message = 'Failed by internal/unknown reasons, report this issue!';
    return response.status(500).json(responseContent);
  }
}
