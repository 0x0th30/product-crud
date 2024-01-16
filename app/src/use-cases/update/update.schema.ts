import { z } from 'zod';

export const UpdateSchema = z.object({
  params: z.object({ code: z.string() }),
  body: z.object({ price: z.number() }),
});
