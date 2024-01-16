import { Product } from '@prisma/client';

export interface ReadByCodeDTO {
  success: boolean,
  data?: { product: Product },
  error?: Error,
}

export interface ReadByCodeHTTPResponse {
  success: boolean,
  data?: { product: Product },
  message?: string,
}
