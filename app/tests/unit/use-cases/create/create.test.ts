import { ProductRepository } from '@repositories/product';
import { ProductRepositoryMock } from '@tests/unit/repositories/product/product.mock';
import { Create } from '@use-cases/create/create.business';

const CreateSUT = new Create(ProductRepositoryMock as any as ProductRepository);

describe('Create class', () => {
  describe('(public) execute method', () => {
    it('should call "productRepository.create" method', () => {
      const code = 'asdf';
      const name = 'foo';
      const price = 10.45;
      const quantity = 10;

      ProductRepositoryMock.create.mockResolvedValueOnce(null as any);

      CreateSUT.execute(code, name, price, quantity);

      expect(ProductRepositoryMock.create).toHaveBeenCalled();
    });
    it('should call "productRepository.create" method w/ provided parameters', () => {
      const code = 'asdf';
      const name = 'foo';
      const price = 10.45;
      const quantity = 10;

      ProductRepositoryMock.create.mockResolvedValueOnce(null as any);

      CreateSUT.execute(code, name, price, quantity);

      expect(ProductRepositoryMock.create)
        .toHaveBeenCalledWith(code, name, price, quantity);
    });
    it('should return success DTO in case of success', () => {
      const code = 'asdf';
      const name = 'foo';
      const price = 10.45;
      const quantity = 10;

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

      ProductRepositoryMock.create.mockResolvedValueOnce(product);

      CreateSUT.execute(code, name, price, quantity).then((response) => {
        expect(response).toEqual(expectedResponse);
      });
    });
    it('should return failed DTO in case of fail', () => {
      const code = 'asdf';
      const name = 'foo';
      const price = 10.45;
      const quantity = 10;

      const error = new Error();
      const expectedResponse = {
        success: false,
        error,
      };

      ProductRepositoryMock.create.mockRejectedValueOnce(error);

      CreateSUT.execute(code, name, price, quantity).then((response) => {
        expect(response).toEqual(expectedResponse);
      });
    });
  });
});
