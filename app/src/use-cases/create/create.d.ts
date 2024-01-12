import { Product } from '@prisma/client';

export interface CreateDTO {
  success: boolean,
  data?: { product: Product },
  error?: Error,
}

export interface CreateHTTPResponse {
  success: boolean,
  data?: { product: Product },
  message?: string,
}
