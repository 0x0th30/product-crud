import { Product } from '@prisma/client';

export interface ReadBySearchDTO {
  success: boolean,
  data?: { products: Array<Product> },
  error?: Error,
}

export interface ReadBySearchHTTPResponse {
  success: boolean,
  data?: { products: Array<Product> },
  message?: string,
}
