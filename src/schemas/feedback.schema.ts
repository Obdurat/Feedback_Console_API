import { z } from "zod";

export const createFeedbackSchema = z.object({
  memberId: z.uuid(),

  type: z.enum(["POSITIVE", "IMPROVEMENT"]),

  category: z.string().min(2).max(50),

  comment: z.string().min(5).max(5000),
});

export type CreateFeedbackDTO = z.infer<typeof createFeedbackSchema>;
