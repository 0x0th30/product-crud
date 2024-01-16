import { z } from 'zod';

export const CreateSchema = z.object({
  body: z.object({
    code: z.string(),
    title: z.string(),
    price: z.number(),
  }),
});
