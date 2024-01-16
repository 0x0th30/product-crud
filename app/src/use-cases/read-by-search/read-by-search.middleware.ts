import { SearchParameters } from 'global';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ProductRepository } from '@repositories/product';
import { ReadBySearch } from './read-by-search.business';
import { ReadBySearchHTTPResponse } from './read-by-search.d';

const ReadBySearchBusiness = new ReadBySearch(
  new ProductRepository(
    new PrismaClient(),
  ),
);

export class ReadBySearchMiddleware {
  public async handle(request: Request, response: Response): Promise<Response> {
    const responseContent: ReadBySearchHTTPResponse = { success: false };

    const page = Number(request.query['page']);
    const limit = Number(request.query['limit']);
    const keyword = request.query['keyword'] as string;

    const search: SearchParameters = { pagination: { page, limit }, keyword };

    const read = await ReadBySearchBusiness.execute(search);

    if (read.success && read.data) {
      responseContent.success = true;
      responseContent.data = read.data;
      return response.status(200).json(responseContent);
    }

    responseContent.success = false;
    responseContent.message = 'Failed by internal/unknown reasons, report this issue!';
    return response.status(500).json(responseContent);
  }
}
