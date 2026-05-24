import { Request, Response } from "express";
import dashboardService from "../services/dashboard.service";

class DashboardController {
  async getStats(_req: Request, res: Response) {
    const stats = await dashboardService.getStats();
    return res.json(stats);
  }

  async getFeedbacksByCategory(_req: Request, res: Response) {
    const data = await dashboardService.getFeedbacksByCategory();
    return res.json(data);
  }

  async getRecentFeedbacks(_req: Request, res: Response) {
    const data = await dashboardService.getRecentFeedbacks();
    return res.json(data);
  }

  async getTopMembersByFeedback(_req: Request, res: Response) {
    const data = await dashboardService.getTopMembersByFeedback();
    return res.json(data);
  }
}

export default new DashboardController();
