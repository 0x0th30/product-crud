import { ProductRepository } from '@repositories/product';
import { ProductRepositoryMock } from '@tests/unit/repositories/product/product.mock';
import { ReadByCode } from '@use-cases/read-by-code/read-by-code.business';

const ReadByCodeSUT = new ReadByCode(ProductRepositoryMock as any as ProductRepository);

describe('ReadByCode class', () => {
  describe('(public) execute method', () => {
    it('should call "productRepository.readByCode" method', () => {
      const code = 'asdf';

      ProductRepositoryMock.readByCode.mockResolvedValueOnce(null as any);

      ReadByCodeSUT.execute(code);

      expect(ProductRepositoryMock.readByCode).toHaveBeenCalled();
    });
    it('should call "productRepository.readByCode" method w/ provided parameters', () => {
      const code = 'asdf';

      ProductRepositoryMock.readByCode.mockResolvedValueOnce(null as any);

      ReadByCodeSUT.execute(code);

      expect(ProductRepositoryMock.readByCode).toHaveBeenCalledWith(code);
    });
    it('should return success DTO in case of success', () => {
      const code = 'asdf';

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

      ProductRepositoryMock.readByCode.mockResolvedValueOnce(product);

      ReadByCodeSUT.execute(code).then((response) => {
        expect(response).toEqual(expectedResponse);
      });
    });
    it('should return failed DTO in case of fail', () => {
      const code = 'asdf';

      const error = new Error();
      const expectedResponse = {
        success: false,
        error,
      };

      ProductRepositoryMock.readByCode.mockRejectedValueOnce(error);

      ReadByCodeSUT.execute(code).then((response) => {
        expect(response).toEqual(expectedResponse);
      });
    });
  });
});
