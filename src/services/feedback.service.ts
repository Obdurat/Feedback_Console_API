import prisma from "../config/prisma";
import { GetFeedbacksQueryDto } from "../dtos/team/get-feedbacks-query.schema";

import { CreateFeedbackDTO } from "../schemas/feedback.schema";

class FeedbackService {
  async getAll(params: GetFeedbacksQueryDto) {
    const { memberId, submittedById, type, category, dateFrom, dateTo } =
      params;

    return prisma.feedback.findMany({
      where: {
        ...(memberId && { memberId }),
        ...(submittedById && { submittedById }),
        ...(type && { type }),
        ...(category && {
          category: { contains: category, mode: "insensitive" },
        }),
        ...((dateFrom || dateTo) && {
          createdAt: {
            ...(dateFrom && { gte: dateFrom }),
            ...(dateTo && { lte: dateTo }),
          },
        }),
      },

      orderBy: { createdAt: "desc" },

      select: {
        id: true,
        type: true,
        category: true,
        comment: true,
        createdAt: true,
        member: { select: { id: true, name: true } },
        submittedBy: { select: { id: true, name: true } },
      },
    });
  }

  async create(data: CreateFeedbackDTO) {
    console.log("Creating feedback with data:", data);
    const creation = await prisma.feedback.create({
      data: {
        memberId: data.memberId,

        submittedById: data.submittedById,

        type: data.type,

        category: data.category,

        comment: data.comment,
      },

      include: {
        member: {
          select: {
            id: true,
            name: true,
          },
        },

        submittedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    console.log("1234");
    return creation;
  }
}

export default new FeedbackService();
