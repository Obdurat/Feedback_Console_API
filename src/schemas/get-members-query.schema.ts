import { z } from "zod";

export const getMembersQuerySchema = z.object({
  page: z.coerce.number().min(1).optional(),

  limit: z.coerce.number().min(1).max(100).optional(),

  search: z.string().optional(),

  role: z.string().optional(),

  status: z.string().optional(),

  wave: z.coerce.number().optional(),
});
