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
    console.log("Query:", query);
    const feedbacks = await feedbackService.getAll(query);
    return res.json(feedbacks);
  }
}

export default new FeedbackController();
