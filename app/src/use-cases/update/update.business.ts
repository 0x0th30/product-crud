import { ProductRepository } from '@repositories/product';
import { logger } from '@utils/logger';
import { UpdateDTO } from './update.d';

export class Update {
  constructor(
    private readonly productRepository: ProductRepository,
  ) { }

  public async execute(
    code: string,
    name?: string,
    price?: number,
    quantity?: number,
  ): Promise<UpdateDTO> {
    logger.info('Initializing "update" service/use-case...');
    const response: UpdateDTO = { success: false };

    logger.info('Sending received product data to repository...');
    await this.productRepository.update(code, name, price, quantity)
      .then((product) => {
        logger.info('Received updated product from repository.');
        response.success = true;
        response.data = { product };
      })
      .catch((error) => {
        logger.error(`Received an error from repository. Details: ${error}`);
        response.success = false;
        response.error = error;
      });

    logger.info('Finishing "update" service/use-case.');
    return response;
  }
}
