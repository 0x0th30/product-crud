import { ProductRepository } from '@repositories/product';
import { ProductRepositoryMock } from '@tests/unit/repositories/product/product.mock';
import { Update } from '@use-cases/update/update.business';

const UpdateSUT = new Update(ProductRepositoryMock as any as ProductRepository);

describe('Update class', () => {
  describe('(public) execute method', () => {
    it('should call "productRepository.update" method', () => {
      const code = 'asdf';
      const price = 10.45;

      ProductRepositoryMock.update.mockResolvedValueOnce(null as any);

      UpdateSUT.execute(code, undefined, price, undefined);

      expect(ProductRepositoryMock.update).toHaveBeenCalled();
    });
    it('should call "productRepository.update" method w/ provided parameters', () => {
      const code = 'asdf';
      const price = 10.45;

      ProductRepositoryMock.update.mockResolvedValueOnce(null as any);

      UpdateSUT.execute(code, undefined, price, undefined);

      expect(ProductRepositoryMock.update)
        .toHaveBeenCalledWith(code, undefined, price, undefined);
    });
    it('should return success DTO in case of success', () => {
      const code = 'asdf';
      const price = 10.45;

      const product = {
        code: 'asdf',
        name: 'foo',
        price: 10.45,
        quantity: 10,
        created_at: new Date('2024-01-19T06:03:33.706Z'),
        updated_at: new Date('2024-01-19T06:03:33.706Z'),
      };
      const expectedResponse = {
        success: true,
        data: { product },
      };

      ProductRepositoryMock.update.mockResolvedValueOnce(product);

      UpdateSUT.execute(code, undefined, price, undefined).then((response) => {
        expect(response).toEqual(expectedResponse);
      });
    });
    it('should return failed DTO in case of fail', () => {
      const code = 'asdf';
      const price = 10.45;

      const error = new Error();
      const expectedResponse = {
        success: false,
        error,
      };

      ProductRepositoryMock.update.mockRejectedValueOnce(error);

      UpdateSUT.execute(code, undefined, price, undefined).then((response) => {
        expect(response).toEqual(expectedResponse);
      });
    });
  });
});
