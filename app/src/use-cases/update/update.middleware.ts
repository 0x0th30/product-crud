import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ProductRepository } from '@repositories/product';
import { Update } from './update.business';
import { UpdateHTTPResponse } from './update.d';

const UpdateBusiness = new Update(
  new ProductRepository(
    new PrismaClient(),
  ),
);

export class UpdateMiddleware {
  public async handle(request: Request, response: Response): Promise<Response> {
    const responseContent: UpdateHTTPResponse = { success: false };

    const { code } = request.params;
    const { price } = request.body;

    const update = await UpdateBusiness.execute(code, price);

    if (update.success && update.data) {
      responseContent.success = true;
      responseContent.data = update.data;
      return response.status(200).json(responseContent);
    }

    responseContent.success = false;
    responseContent.message = 'Failed by internal/unknown reasons, report this issue!';
    return response.status(500).json(responseContent);
  }
}
