import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ProductRepository } from '@repositories/product';
import { Create } from './create.business';
import { CreateHTTPResponse } from './create.d';

const CreateBusiness = new Create(
  new ProductRepository(
    new PrismaClient(),
  ),
);

export class CreateMiddleware {
  public async handle(request: Request, response: Response): Promise<Response> {
    const responseContent: CreateHTTPResponse = { success: false };

    const { code, title, price } = request.body;

    const create = await CreateBusiness.execute(code, title, price);

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
