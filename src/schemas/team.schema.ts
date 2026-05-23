import { z } from "zod";

export const createTeamMemberSchema = z.object({
  name: z.string().min(2),
  employeeCode: z.string().min(1),
  status: z.enum(["Active", "Inactive"]),
  hiringDate: z.coerce.date(),
  wave: z.number().int().min(0),
  roleId: z.string().uuid(),
  reportsToId: z.string().uuid().optional(),
});

export const updateTeamMemberSchema = createTeamMemberSchema.partial();

export type CreateTeamMemberDTO = z.infer<typeof createTeamMemberSchema>;
export type UpdateTeamMemberDTO = z.infer<typeof updateTeamMemberSchema>;
