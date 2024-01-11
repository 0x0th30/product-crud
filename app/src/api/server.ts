import express from 'express';
import { router } from '@api/routes';
import { logger } from '@utils/logger';

export class Server {
  private app = express();

  private host = process.env['HOST'] || 'localhost';

  private port = process.env['PORT'] || 3000;

  private loadServerConfigs(): void {
    logger.info('Setting up server configs...');
    this.app.use(express.json());
    this.app.use('/api/v1', router);
  }

  private bindServer(): void {
    logger.info(`Binding server on specified port (${this.port})...`);
    this.app.listen(this.port, () => {
      logger.info(`Running application at http://${this.host}:${this.port}/`);
    });
  }

  public start(): void {
    logger.info('Starting HTTP server...');
    this.loadServerConfigs();
    this.bindServer();
  }
}
