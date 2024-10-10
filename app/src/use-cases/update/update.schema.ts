import { z } from 'zod';

export const UpdateSchema = z.object({
  params: z.object({ code: z.string() }),
  body: z.object({
    name: z.string(50).optional(),
    price: z.number().positive().optional(),
    quantity: z.number().positive().optional(),
  }),
});
