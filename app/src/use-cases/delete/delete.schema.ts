import { z } from 'zod';

export const DeleteSchema = z.object({
  body: z.object({
    codes: z.string().array(),
  }),
});
