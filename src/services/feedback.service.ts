import prisma from "../config/prisma";

import { CreateFeedbackDTO } from "../schemas/feedback.schema";

class FeedbackService {
  async create(data: CreateFeedbackDTO) {
    return prisma.feedback.create({
      data: {
        memberId: data.memberId,

        type: data.type,

        category: data.category,

        comment: data.comment,
      },
    });
  }
}

export default new FeedbackService();
