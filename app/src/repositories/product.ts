import { SearchParameters } from 'global';
import { PrismaClient, Product } from '@prisma/client';
import { NotFoundProduct, NotUniqueCode } from '@errors/product-error';

export class ProductRepository {
  constructor(
    private readonly client: PrismaClient,
  ) {}

  public async create(code: string, title: string, price: number): Promise<Product> {
    const product = await this.client.product.create({ data: { code, title, price } })
      .catch((error) => {
        if (error.code === 'P2002') throw new NotUniqueCode(code);
        throw error;
      });

    return product;
  }

  public async readByCode(code: string): Promise<Product> {
    const where = { code };

    const product = await this.client.product.findFirst({ where });

    if (!product) throw new NotFoundProduct(code);
    return product;
  }

  public async readBySearch(search: SearchParameters): Promise<Array<Product>> {
    const skip = ((search.pagination.page - 1) * search.pagination.limit);

    if (search.keyword) {
      const where = { title: { contains: search.keyword } };
      const products = await this.client.product.findMany({ skip, where });
      return products;
    }

    const products = await this.client.product.findMany({ skip });
    return products;
  }

  public async updatePrice(code: string, price: number): Promise<Product> {
    const where = { code };
    const data = { price };

    const product = await this.client.product.update({ where, data });

    return product;
  }
}
