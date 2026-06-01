import prisma from "../config/prisma";
import { GetFeedbacksQueryDto } from "../dtos/team/get-feedbacks-query.schema";
import sseManager from "../utils/sse";
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
        acknowledgedAt: true,
        viewed: true,
        viewedAt: true,
      },
    });
  }

  async create(data: CreateFeedbackDTO) {
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

    sseManager.broadcast("feedback:created", creation);

    return creation;
  }

  async markAsViewed(feedbackId: string) {
    const feedback = await prisma.feedback.update({
      where: { id: feedbackId },
      data: {
        viewed: true,
        viewedAt: new Date(),
      },
    });

    sseManager.broadcast("feedback:viewed", feedback);
    return feedback;
  }

  async acknowledge(feedbackId: string) {
    const feedback = await prisma.feedback.update({
      where: { id: feedbackId },
      data: { acknowledgedAt: new Date() },
    });

    sseManager.broadcast("feedback:acknowledged", feedback);
    return feedback;
  }
}

export default new FeedbackService();
