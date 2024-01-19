import { SearchParameters } from 'global';
import { ProductRepository } from '@repositories/product';
import { logger } from '@utils/logger';
import { ReadBySearchDTO } from './read-by-search.d';

export class ReadBySearch {
  private readonly MAX_RETURNED_ROWS = 50;

  constructor(
    private readonly productRepository: ProductRepository,
  ) { }

  public async execute(search: SearchParameters): Promise<ReadBySearchDTO> {
    logger.info('Initializing "read-by-search" service/use-case...');
    const response: ReadBySearchDTO = { success: false };

    if (search.pagination.limit > this.MAX_RETURNED_ROWS) {
      // eslint-disable-next-line no-param-reassign
      search.pagination.limit = this.MAX_RETURNED_ROWS;
    }

    logger.info('Sending a read by search request to repository...');
    await this.productRepository.readBySearch(search)
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
