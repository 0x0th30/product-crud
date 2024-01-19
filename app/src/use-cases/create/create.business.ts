import { ProductRepository } from '@repositories/product';
import { logger } from '@utils/logger';
import { CreateDTO } from './create.d';

export class Create {
  constructor(
    private readonly productRepository: ProductRepository,
  ) {}

  public async execute(code: string, title: string, price: number): Promise<CreateDTO> {
    logger.info('Initializing "create" service/use-case...');
    const response: CreateDTO = { success: false };

    logger.info('Sending received product data to repository...');
    await this.productRepository.create(code, title, price)
      .then((product) => {
        logger.info('Received created product from repository.');
        response.success = true;
        response.data = { product };
      })
      .catch((error) => {
        logger.error(`Received an error from repository. Details: ${error}`);
        response.success = false;
        response.error = error;
      });

    logger.info('Finishing "create" service/use-case.');
    return response;
  }
}
