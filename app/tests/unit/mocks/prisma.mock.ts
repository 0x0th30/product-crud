import { PrismaClient } from '@prisma/client';

export const PrismaMock = {
  product: {
    create: jest.spyOn(new PrismaClient().product, 'create'),
    createMany: jest.spyOn(new PrismaClient().product, 'createMany'),
    findFirst: jest.spyOn(new PrismaClient().product, 'findFirst'),
    findMany: jest.spyOn(new PrismaClient().product, 'findMany'),
    update: jest.spyOn(new PrismaClient().product, 'update'),
  },
  task: {
    create: jest.spyOn(new PrismaClient().task, 'create'),
    findFirst: jest.spyOn(new PrismaClient().task, 'findFirst'),
    update: jest.spyOn(new PrismaClient().task, 'update'),
  },
};
