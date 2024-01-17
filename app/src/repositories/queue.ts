import { RedisClientType } from 'redis';

export class Queue {
  constructor(
    private client: RedisClientType,
  ) {}

  public async sendToQueue(message: object): Promise<void> {
    const stringifiedMessage = JSON.stringify(message);
  }
}
