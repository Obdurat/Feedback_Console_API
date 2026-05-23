export interface GetMembersQueryDto {
  page?: number;

  limit?: number;

  search?: string;

  role?: string;

  status?: string;

  wave?: number;
}
