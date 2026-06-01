import prisma from "../config/prisma";

import { GetMembersQueryDto } from "../dtos/team/get-members-query.dto";
import {
  CreateTeamMemberDTO,
  UpdateTeamMemberDTO,
} from "../schemas/team.schema";
import CustomError from "../utils/customError";

class TeamService {
  async getAll(params: GetMembersQueryDto) {
    const { page = 1, limit = 10, search, role, status, wave } = params;

    return prisma.teamMember.findMany({
      where: {
        ...(search && {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }),

        ...(status && {
          status,
        }),

        ...(wave && {
          wave,
        }),

        ...(role && {
          role: {
            name: role,
          },
        }),
      },

      skip: (page - 1) * limit,

      take: limit,

      orderBy: [
        {
          wave: "asc",
        },

        {
          name: "asc",
        },
      ],

      select: {
        id: true,
        name: true,
        status: true,
        hiringDate: true,
        wave: true,
        createdAt: true,
        employeeCode: true,

        role: {
          select: {
            id: true,
            name: true,
          },
        },

        reportsTo: {
          select: {
            id: true,
            name: true,
          },
        },

        receivedFeedbacks: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            type: true,
            category: true,
            comment: true,
            createdAt: true,
            viewed: true,
            viewedAt: true,

            submittedBy: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async getById(id: string) {
    const member = await prisma.teamMember.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        employeeCode: true,
        status: true,
        hiringDate: true,
        wave: true,
        createdAt: true,
        updatedAt: true,
        role: { select: { id: true, name: true } },
        reportsTo: { select: { id: true, name: true } },
        receivedFeedbacks: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            type: true,
            category: true,
            comment: true,
            createdAt: true,
            submittedBy: { select: { id: true, name: true } },
            viewed: true,
            viewedAt: true,
          },
        },
      },
    });

    if (!member) throw new CustomError("Team member not found", 404);
    return member;
  }

  async getMyFeedbacks(id: string) {
    const member = await this.getById(id); // 404 if not found
    if (!member) throw new CustomError("Member not found", 404);

    const total = member.receivedFeedbacks.length;
    const positive = member.receivedFeedbacks.filter(
      (f) => f.type === "POSITIVE",
    ).length;
    const improvement = member.receivedFeedbacks.filter(
      (f) => f.type === "IMPROVEMENT",
    ).length;

    return {
      member,
      stats: {
        total,
        positive,
        improvement,
        positiveRatio: total > 0 ? Math.round((positive / total) * 100) : 0,
      },
    };
  }

  async create(data: CreateTeamMemberDTO) {
    // Validate roleId exists
    const role = await prisma.role.findUnique({ where: { id: data.roleId } });
    if (!role) throw new CustomError("Role not found", 404);

    // Validate reportsToId if provided
    if (data.reportsToId) {
      const manager = await prisma.teamMember.findUnique({
        where: { id: data.reportsToId },
      });
      if (!manager) throw new CustomError("Reporting manager not found", 404);
    }

    return prisma.teamMember.create({
      data,
      select: {
        id: true,
        name: true,
        employeeCode: true,
        status: true,
        hiringDate: true,
        wave: true,
        createdAt: true,
        role: { select: { id: true, name: true } },
        reportsTo: { select: { id: true, name: true } },
      },
    });
  }

  async update(id: string, data: UpdateTeamMemberDTO) {
    await this.getById(id); // 404 if not found

    if (data.roleId) {
      const role = await prisma.role.findUnique({ where: { id: data.roleId } });
      if (!role) throw new CustomError("Role not found", 404);
    }

    if (data.reportsToId) {
      const manager = await prisma.teamMember.findUnique({
        where: { id: data.reportsToId },
      });
      if (!manager) throw new CustomError("Reporting manager not found", 404);
    }

    return prisma.teamMember.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        employeeCode: true,
        status: true,
        hiringDate: true,
        wave: true,
        updatedAt: true,
        role: { select: { id: true, name: true } },
        reportsTo: { select: { id: true, name: true } },
      },
    });
  }

  async remove(id: string) {
    await this.getById(id); // 404 if not found

    // Prevent deletion if the member has subordinates
    const subordinates = await prisma.teamMember.count({
      where: { reportsToId: id },
    });
    if (subordinates > 0)
      throw new CustomError("Cannot delete a member who has subordinates", 409);

    await prisma.teamMember.delete({ where: { id } });
  }

  async resetTotp(id: string) {
    await this.getById(id); // 404 if not found

    return prisma.teamMember.update({
      where: { id },
      data: {
        totpSecret: null,
        totpEnabled: false,
      },
      select: {
        id: true,
        name: true,
        totpEnabled: true,
      },
    });
  }
}

export default new TeamService();
