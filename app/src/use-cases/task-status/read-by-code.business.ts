import { ProductRepository } from '@repositories/product';
import { logger } from '@utils/logger';
import { ReadByCodeDTO } from './read-by-code.d';

export class ReadByCode {
  constructor(
    private readonly repository: ProductRepository,
  ) { }

  public async execute(code: string): Promise<ReadByCodeDTO> {
    logger.info('Initializing "read-by-code" service/use-case...');
    const response: ReadByCodeDTO = { success: false };

    logger.info('Sending a read by code request to repository...');
    await this.repository.readByCode(code)
      .then((product) => {
        logger.info('Received found products from repository.');
        response.success = true;
        response.data = { product };
      })
      .catch((error) => {
        logger.error(`Received an error from repository. Details: ${error}`);
        response.success = false;
        response.error = error;
      });

    logger.info('Finishing "read-by-code" service/use-case.');
    return response;
  }
}
