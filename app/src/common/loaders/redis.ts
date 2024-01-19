import { RedisClientType, createClient } from 'redis';
import { logger } from '@utils/logger';

export class Redis {
  private TIMEOUT_IN_MS: number;

  private client: RedisClientType;

  constructor() {
    const TIMEOUT_IN_MS = 5000;
    const url = process.env['REDIS_URL'];

    this.TIMEOUT_IN_MS = TIMEOUT_IN_MS;
    this.client = createClient({
      url,
      socket: { reconnectStrategy: TIMEOUT_IN_MS },
    });
  }

  public getClient(): RedisClientType {
    this.connect();
    this.setOnReady();
    this.setOnError();

    return this.client;
  }

  private setOnReady(): void {
    this.client.on('ready', () => {
      logger.info('Redis connection was successfully established!');
    });
  }

  private setOnError(): void {
    this.client.on('error', (error) => {
      logger.error(`Redis connection has been failed: ${error}.`
        + ` Trying again in ${this.TIMEOUT_IN_MS}ms...`);
    });
  }

  private connect(): void {
    this.client.connect();
  }
}
