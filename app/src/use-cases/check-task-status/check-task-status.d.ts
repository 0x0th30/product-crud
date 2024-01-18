import { Task } from '@prisma/client';

export interface CheckTaskStatusDTO {
  success: boolean,
  data?: { task: Task },
  error?: Error,
}

export interface CheckTaskStatusHTTPResponse {
  success: boolean,
  data?: { task: Task },
  message?: string,
}
