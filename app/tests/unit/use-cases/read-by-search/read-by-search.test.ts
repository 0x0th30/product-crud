import { ProductRepository } from '@repositories/product';
import { ProductRepositoryMock } from '@tests/unit/repositories/product/product.mock';
import { ReadBySearch } from '@use-cases/read-by-search/read-by-search.business';

const ReadBySearchSUT = new ReadBySearch(
  ProductRepositoryMock as any as ProductRepository,
);

describe('ReadBySearch class', () => {
  describe('(public) execute method', () => {
    it('should call "productRepository.readBySearch" method', () => {
      const search = {
        pagination: { page: 2, limit: 10 },
        keyword: '',
      };

      ProductRepositoryMock.readBySearch.mockResolvedValueOnce(null as any);

      ReadBySearchSUT.execute(search);

      expect(ProductRepositoryMock.readBySearch).toHaveBeenCalled();
    });
    it('should call "productRepository.readBySearch" method w/ provided'
    + ' parameters', () => {
      const search = {
        pagination: { page: 2, limit: 10 },
        keyword: '',
      };

      ProductRepositoryMock.readBySearch.mockResolvedValueOnce(null as any);

      ReadBySearchSUT.execute(search);

      expect(ProductRepositoryMock.readBySearch).toHaveBeenCalledWith(search);
    });
    it('should return success DTO in case of success', () => {
      const search = {
        pagination: { page: 2, limit: 10 },
        keyword: '',
      };

      const products = [
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
      const expectedResponse = {
        success: true,
        data: { products },
      };

      ProductRepositoryMock.readBySearch.mockResolvedValueOnce(products);

      ReadBySearchSUT.execute(search).then((response) => {
        expect(response).toEqual(expectedResponse);
      });
    });
    it('should return failed DTO in case of fail', () => {
      const search = {
        pagination: { page: 2, limit: 10 },
        keyword: '',
      };

      const error = new Error();
      const expectedResponse = {
        success: false,
        error,
      };

      ProductRepositoryMock.readBySearch.mockRejectedValueOnce(error);

      ReadBySearchSUT.execute(search).then((response) => {
        expect(response).toEqual(expectedResponse);
      });
    });
  });
});
