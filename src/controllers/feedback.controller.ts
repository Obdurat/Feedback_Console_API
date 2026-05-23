import { Request, Response } from "express";

import feedbackService from "../services/feedback.service";

class FeedbackController {
  async create(req: Request, res: Response) {
    const feedback = await feedbackService.create(req.body);

    return res.status(201).json(feedback);
  }
}

export default new FeedbackController();
