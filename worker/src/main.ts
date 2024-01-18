import { ProductRepository } from '@repositories/product';
import { PrismaClient } from '@prisma/client';
import { Redis } from '@loaders/redis';
import { ProcessProducts } from '@events/process-products';

const fo = new ProcessProducts(
  new ProductRepository(
    new PrismaClient(),
  ),
  new Redis(),
);

fo.execute();
