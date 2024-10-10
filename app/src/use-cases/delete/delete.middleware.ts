import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ProductRepository } from '@repositories/product';
import { Delete } from './delete.business';
import { DeleteHTTPResponse } from './delete.d';

const DeleteBusiness = new Delete(
  new ProductRepository(
    new PrismaClient(),
  ),
);

export class DeleteMiddleware {
  public async handle(request: Request, response: Response): Promise<Response> {
    const responseContent: DeleteHTTPResponse = { success: false };

    const { codes } = request.body;

    const deleteProducts = await DeleteBusiness.execute(codes);

    if (deleteProducts.success && deleteProducts.data) {
      responseContent.success = true;
      responseContent.data = deleteProducts.data;
      return response.status(200).json(responseContent);
    }

    responseContent.success = false;
    responseContent.message = 'Failed by internal/unknown reasons, report this issue!';
    return response.status(500).json(responseContent);
  }
}
