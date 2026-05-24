import { Request, Response } from "express";

import feedbackService from "../services/feedback.service";
import { getFeedbacksQuerySchema } from "../dtos/team/get-feedbacks-query.schema";

class FeedbackController {
  async create(req: Request, res: Response) {
    const feedback = await feedbackService.create(req.body);
    return res.status(201).json(feedback);
  }

  async getAll(req: Request, res: Response) {
    const query = getFeedbacksQuerySchema.parse(req.query);
    const feedbacks = await feedbackService.getAll(query);
    return res.json(feedbacks);
  }

  async markAsViewed(req: Request, res: Response) {
    const feedbackId = req.params.id;
    console.log(`Marking feedback ${feedbackId} as viewed`); // Debug log
    const feedback = await feedbackService.markAsViewed(feedbackId as string);
    return res.json(feedback);
  }
}
export default new FeedbackController();
