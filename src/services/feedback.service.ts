import prisma from "../config/prisma";

import { CreateFeedbackDTO } from "../schemas/feedback.schema";

class FeedbackService {
  async create(data: CreateFeedbackDTO) {
    return prisma.feedback.create({
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
  }
}

export default new FeedbackService();
