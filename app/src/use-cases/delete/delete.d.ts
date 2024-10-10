export interface DeleteDTO {
  success: boolean,
  data?: { deletedProducts: number },
  error?: Error,
}

export interface DeleteHTTPResponse {
  success: boolean,
  data?: { deletedProducts: number },
  message?: string,
}
