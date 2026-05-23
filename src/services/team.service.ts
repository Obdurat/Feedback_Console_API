import prisma from "../config/prisma";

class TeamService {
  async getAll() {
    return prisma.teamMember.findMany({
      include: {
        feedbacks: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  }
}

export default new TeamService();
