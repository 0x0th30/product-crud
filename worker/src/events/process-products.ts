import { Redis } from '@loaders/redis';
import { ProductRepository } from '@repositories/product';
import { RedisClientType } from 'redis';

export class ProcessProducts {
  private redisClient: RedisClientType;

  constructor(
    private readonly repository: ProductRepository,
    redis: Redis,
  ) {
    this.redisClient = redis.getClient();
  }

  public async execute(): Promise<void> {
    const queue = 'products';
    const timeout = 0;

    this.redisClient.blPop(queue, timeout)
      .then((value) => {
        if (value && value.key === queue) {
          const task = JSON.parse(value.element);
          this.repository.create(task.code, task.title, Number(task.price));
        }

        return this.execute();
      });
  }
}
