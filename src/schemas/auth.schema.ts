import { z } from "zod";

export const initLoginSchema = z.object({
  employeeCode: z.string().min(1),
});

export const verifyTotpSchema = z.object({
  memberId: z.string().uuid(),
  code: z.string().length(6),
});
