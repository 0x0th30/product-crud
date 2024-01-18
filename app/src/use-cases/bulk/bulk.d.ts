export interface BulkDTO {
  success: boolean,
  data?: { taskId: string, enqueuedProducts: number },
  error?: Error,
}

export interface BulkHTTPResponse {
  success: boolean,
  data?: { taskId: string, enqueuedProducts: number },
  message?: string,
}
