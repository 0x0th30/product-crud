import { z } from 'zod';

export const CreateSchema = z.object({
  body: z.object({
    code: z.string().max(10),
    name: z.string().max(50),
    price: z.number().positive(),
    quantity: z.number().positive(),
  }),
});
