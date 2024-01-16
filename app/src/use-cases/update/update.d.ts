import { Product } from '@prisma/client';

export interface UpdateDTO {
  success: boolean,
  data?: { product: Product },
  error?: Error,
}

export interface UpdateHTTPResponse {
  success: boolean,
  data?: { product: Product },
  message?: string,
}
