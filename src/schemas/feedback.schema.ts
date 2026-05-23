import { z } from "zod";

export const createFeedbackSchema = z.object({
  memberId: z.string().uuid(),

  submittedById: z.string().uuid(),

  type: z.enum(["POSITIVE", "IMPROVEMENT"]),

  category: z.string().min(2),

  comment: z.string().min(5),
});

export type CreateFeedbackDTO = z.infer<typeof createFeedbackSchema>;
