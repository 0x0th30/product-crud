import { z } from 'zod';

export const CheckTaskStatusSchema = z.object({
  params: z.object({ id: z.string() }),
});
