import { SearchParameters } from 'global';
import { PrismaClient } from '@prisma/client';
import { ProductRepository } from '@repositories/product';
import { PrismaMock } from '@mocks/prisma.mock';
import { NotFoundItem, NotUniqueId } from '@errors/repository-error';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const ProductRepositorySUT = new ProductRepository(PrismaMock as any as PrismaClient);

describe('ProductRepository class', () => {
  describe('(public) create method', () => {
    it('should call "product.create"', () => {
      const code = 'ASDF';
      const title = 'foo';
      const price = 10.45;

      PrismaMock.product.create.mockResolvedValueOnce(null as any);

      ProductRepositorySUT.create(code, title, price);

      expect(PrismaMock.product.create).toHaveBeenCalled();
    });
    it('should call "product.create" w/ received parameter', () => {
      const code = 'ASDF';
      const title = 'foo';
      const price = 10.45;

      PrismaMock.product.create.mockResolvedValueOnce(null as any);

      ProductRepositorySUT.create(code, title, price);
      const expectedParameters = { data: { code, title, price } };

      expect(PrismaMock.product.create).toHaveBeenCalledWith(expectedParameters);
    });
    it('should throw "NotUniqueId" if error code is "P2002"', () => {
      const code = 'ASDF';
      const title = 'foo';
      const price = 10.45;

      PrismaMock.product.create.mockRejectedValueOnce(
        new PrismaClientKnownRequestError('foo', { code: 'P2002', clientVersion: '0' }),
      );

      ProductRepositorySUT.create(code, title, price).catch((error) => {
        expect(error).toBeInstanceOf(NotUniqueId);
      });
    });
    it('should re-throw error if not recognize it', () => {
      const code = 'ASDF';
      const title = 'foo';
      const price = 10.45;

      PrismaMock.product.create.mockRejectedValueOnce(new Error());

      ProductRepositorySUT.create(code, title, price).catch((error) => {
        expect(error).toBeInstanceOf(Error);
      });
    });
    it('should return created product', () => {
      const code = 'ASDF';
      const title = 'foo';
      const price = 10.45;
      const createdAt = new Date('2024-01-19T06:03:33.706Z');
      const updatedAt = new Date('2024-01-19T06:03:33.706Z');

      PrismaMock.product.create.mockResolvedValueOnce({
        code,
        title,
        price,
        created_at: createdAt,
        updated_at: updatedAt,
      });

      ProductRepositorySUT.create(code, title, price)
        .then((product) => {
          expect(product.code).toEqual(code);
          expect(product.title).toEqual(title);
          expect(product.price).toEqual(price);
          expect(product.created_at).toEqual(createdAt);
          expect(product.updated_at).toEqual(updatedAt);
        });
    });
  });
  describe('(public) createMany method', () => {
    it('should call "product.createMany"', () => {
      const code = 'ASDF';
      const title = 'foo';
      const price = 10.45;

      PrismaMock.product.createMany.mockResolvedValueOnce(null as any);

      ProductRepositorySUT.createMany([{ code, title, price }]);

      expect(PrismaMock.product.createMany).toHaveBeenCalled();
    });
    it('should call "product.createMany" w/ received content', () => {
      const code = 'ASDF';
      const title = 'foo';
      const price = 10.45;

      PrismaMock.product.createMany.mockResolvedValueOnce(null as any);

      ProductRepositorySUT.createMany([{ code, title, price }]);
      const expectedParameters = { data: [{ code, title, price }] };

      expect(PrismaMock.product.createMany).toHaveBeenCalledWith(expectedParameters);
    });
    it('should throw "NotUniqueId" if error code is "P2002"', () => {
      const code = 'ASDF';
      const title = 'foo';
      const price = 10.45;

      PrismaMock.product.createMany.mockRejectedValueOnce(
        new PrismaClientKnownRequestError('foo', { code: 'P2002', clientVersion: '0' }),
      );

      ProductRepositorySUT.createMany([{ code, title, price }]).catch((error) => {
        expect(error).toBeInstanceOf(NotUniqueId);
      });
    });
    it('should re-throw error if not recognize it', () => {
      const code = 'ASDF';
      const title = 'foo';
      const price = 10.45;

      PrismaMock.product.createMany.mockRejectedValueOnce(new Error());

      ProductRepositorySUT.createMany([{ code, title, price }]).catch((error) => {
        expect(error).toBeInstanceOf(Error);
      });
    });
  });
  describe('(public) readByCode method', () => {
    it('should call "product.findFirst"', () => {
      const code = 'asdf';

      PrismaMock.product.findFirst.mockResolvedValueOnce({} as any);

      ProductRepositorySUT.readByCode(code);

      expect(PrismaMock.product.findFirst).toHaveBeenCalled();
    });
    it('should call "product.findFirst" w/ provided code', () => {
      const code = 'asdf';

      PrismaMock.product.findFirst.mockResolvedValueOnce({} as any);

      ProductRepositorySUT.readByCode(code);
      const expectedParameters = { where: { code } };

      expect(PrismaMock.product.findFirst).toHaveBeenCalledWith(expectedParameters);
    });
    it('should throw "NotFoundItem" if cannot found product', () => {
      const code = 'asdf';

      PrismaMock.product.findFirst.mockResolvedValueOnce(null);

      ProductRepositorySUT.readByCode(code).catch((error) => {
        expect(error).toBeInstanceOf(NotFoundItem);
      });
    });
    it('should return found product', () => {
      const code = 'asdf';

      const expectedProduct = {
        code: 'asdf',
        title: 'bar',
        price: 0.99,
        created_at: new Date('2024-01-19T06:03:33.706Z'),
        updated_at: new Date('2024-01-19T06:03:33.706Z'),
      };
      PrismaMock.product.findFirst.mockResolvedValueOnce(expectedProduct);

      ProductRepositorySUT.readByCode(code).then((product) => {
        expect(product).toEqual(expectedProduct);
      });
    });
  });
  describe('(public) readBySearch method', () => {
    it('should call "product.findMany"', () => {
      const search: SearchParameters = {
        pagination: { page: 1, limit: 1 },
        keyword: '',
      };

      PrismaMock.product.findMany.mockResolvedValueOnce(null as any);

      ProductRepositorySUT.readBySearch(search);

      expect(PrismaMock.product.findMany).toHaveBeenCalled();
    });
    it('should calc skip based on provided parameters', () => {
      const search: SearchParameters = {
        pagination: { page: 2, limit: 10 },
        keyword: '',
      };

      PrismaMock.product.findMany.mockResolvedValueOnce(null as any);

      ProductRepositorySUT.readBySearch(search);
      const skip = ((search.pagination.page - 1) * search.pagination.limit);
      const expectedParameters = { skip };

      expect(PrismaMock.product.findMany).toHaveBeenCalledWith(expectedParameters);
    });
    it('should include "where" in "product.findMany" call if keyword', () => {
      const search: SearchParameters = {
        pagination: { page: 2, limit: 10 },
        keyword: 'foo',
      };

      PrismaMock.product.findMany.mockResolvedValueOnce(null as any);

      ProductRepositorySUT.readBySearch(search);
      const skip = ((search.pagination.page - 1) * search.pagination.limit);
      const where = { title: { contains: search.keyword } };
      const expectedParameters = { skip, where };

      expect(PrismaMock.product.findMany).toHaveBeenCalledWith(expectedParameters);
    });
    it('should return found products', () => {
      const search: SearchParameters = {
        pagination: { page: 2, limit: 10 },
        keyword: '',
      };

      const expectedProducts = [
        {
          code: 'foo1',
          title: 'bar',
          price: 0.99,
          created_at: new Date('2024-01-19T06:03:33.706Z'),
          updated_at: new Date('2024-01-19T06:03:33.706Z'),
        },
        {
          code: 'foo2',
          title: 'bar',
          price: 0.99,
          created_at: new Date('2024-01-19T06:03:33.706Z'),
          updated_at: new Date('2024-01-19T06:03:33.706Z'),
        },
      ];

      PrismaMock.product.findMany.mockResolvedValueOnce(expectedProducts);

      ProductRepositorySUT.readBySearch(search).then((products) => {
        expect(products).toEqual(expectedProducts);
      });
    });
  });
  describe('(public) updatePrice method', () => {
    it('should call "product.update"', () => {
      const code = 'ASDF';
      const price = 10.45;

      PrismaMock.product.update.mockResolvedValueOnce(null as any);

      ProductRepositorySUT.updatePrice(code, price);

      expect(PrismaMock.product.update).toHaveBeenCalled();
    });
    it('should call "product.update" w/ provided parameter', () => {
      const code = 'ASDF';
      const price = 10.45;

      PrismaMock.product.update.mockResolvedValueOnce(null as any);

      ProductRepositorySUT.updatePrice(code, price);
      const where = { code };
      const data = { price };
      const expectedParameters = { where, data };

      expect(PrismaMock.product.update).toHaveBeenCalledWith(expectedParameters);
    });
    it('should return updated product', () => {
      const code = 'ASDF';
      const price = 10.45;

      const expectedProduct = {
        code: 'ASDF',
        title: 'bar',
        price: 10.45,
        created_at: new Date('2024-01-19T06:03:33.706Z'),
        updated_at: new Date('2024-01-19T06:03:33.706Z'),
      };
      PrismaMock.product.update.mockResolvedValueOnce(expectedProduct);

      ProductRepositorySUT.updatePrice(code, price).then((product) => {
        expect(product).toEqual(expectedProduct);
      });
    });
  });
});
