import { z } from "zod";

export const getFeedbacksQuerySchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),

  memberId: z.string().uuid().optional(),
  submittedById: z.string().uuid().optional(),

  type: z.enum(["POSITIVE", "IMPROVEMENT"]).optional(),
  category: z.string().optional(),

  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
});

export type GetFeedbacksQueryDto = z.infer<typeof getFeedbacksQuerySchema>;
