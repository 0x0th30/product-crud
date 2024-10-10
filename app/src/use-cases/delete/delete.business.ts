import { ProductRepository } from '@repositories/product';
import { logger } from '@utils/logger';
import { DeleteDTO } from './delete.d';

export class Delete {
  constructor(
    private readonly productRepository: ProductRepository,
  ) { }

  public async execute(codes: string[]): Promise<DeleteDTO> {
    logger.info('Initializing "delete" service/use-case...');
    const response: DeleteDTO = { success: false };

    logger.info('Sending a code list to be deleted from repository...');
    await this.productRepository.deleteMany(codes)
      .then((deletedProducts) => {
        logger.info('Received deleted product count from repository.');
        response.success = true;
        response.data = { deletedProducts };
      })
      .catch((error) => {
        logger.error(`Received an error from repository. Details: ${error}`);
        response.success = false;
        response.error = error;
      });

    logger.info('Finishing "delete" service/use-case.');
    return response;
  }
}
