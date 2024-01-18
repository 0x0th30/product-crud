import { ProductRepository } from '@repositories/product';
import { PrismaClient } from '@prisma/client';
import { Redis } from '@loaders/redis';
import { ProcessProducts } from '@events/process-products';
import { TaskRepository } from '@repositories/task';

const fo = new ProcessProducts(
  new ProductRepository(
    new PrismaClient(),
  ),
  new TaskRepository(
    new PrismaClient(),
  ),
  new Redis(),
);

fo.execute();
