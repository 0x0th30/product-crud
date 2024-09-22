import { z } from 'zod';

export const ReadByCodeSchema = z.object({
  params: z.object({ code: z.string().max(10) }),
});
