import { PrismaClient, Product } from '@prisma/client';

export class ProductRepository {
  constructor(
    private readonly client: PrismaClient,
  ) {}

  public async create(code: string, title: string, price: number): Promise<Product> {
    return null as any as Product;
  }

  public async readByCode(code: string): Promise<Product> {
    return null as any as Product;
  }

  public async readByTitleMatch(search: string): Promise<Array<Product>> {
    return null as any as Array<Product>;
  }

  public async readAll(page: number, limit: number): Promise<Array<Product>> {
    return null as any as Array<Product>;
  }

  public async updatePrice(price: number): Promise<Product> {
    return null as any as Product;
  }

  public async delete(code: string): Promise<Product> {
    return null as any as Product;
  }
}
