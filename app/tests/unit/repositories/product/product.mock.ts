import { ProductRepository } from '@repositories/product';

export const ProductRepositoryMock = {
  create: jest.spyOn(ProductRepository.prototype, 'create'),
  createMany: jest.spyOn(ProductRepository.prototype, 'createMany'),
  readByCode: jest.spyOn(ProductRepository.prototype, 'readByCode'),
  readBySearch: jest.spyOn(ProductRepository.prototype, 'readBySearch'),
  updatePrice: jest.spyOn(ProductRepository.prototype, 'updatePrice'),
};
