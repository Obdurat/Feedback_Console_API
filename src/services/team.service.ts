import prisma from "../config/prisma";

import { GetMembersQueryDto } from "../dtos/team/get-members-query.dto";

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
}

export default new TeamService();
