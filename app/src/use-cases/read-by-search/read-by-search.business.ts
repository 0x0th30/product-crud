import { SearchParameters } from 'global';
import { ProductRepository } from '@repositories/product';
import { logger } from '@utils/logger';
import { ReadBySearchDTO } from './read-by-search.d';

export class ReadBySearch {
  constructor(
    private readonly repository: ProductRepository,
  ) { }

  public async execute(search: SearchParameters): Promise<ReadBySearchDTO> {
    logger.info('Initializing "read-by-search" service/use-case...');
    const response: ReadBySearchDTO = { success: false };

    logger.info('Sending a read by search request to repository...');
    await this.repository.readBySearch(search)
      .then((products) => {
        logger.info('Received found products from repository.');
        response.success = true;
        response.data = { products };
      })
      .catch((error) => {
        logger.error(`Received an error from repository. Details: ${error}`);
        response.success = false;
        response.error = error;
      });

    logger.info('Finishing "read-by-search" service/use-case.');
    return response;
  }
}
