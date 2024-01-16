import { z } from 'zod';

export const ReadBySearchSchema = z.object({
  query: z.object({
    page: z.string(),
    limit: z.string(),
    keyword: z.string().optional(),
  }),
});
