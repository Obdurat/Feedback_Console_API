import { Request, Response } from "express";
import dashboardService from "../services/dashboard.service";
import sseManager from "../utils/sse";

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

  async subscribe(req: Request, res: Response) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    // Send initial ping to confirm connection
    res.write("event: connected\ndata: {}\n\n");

    sseManager.addClient(res);

    // Clean up when client disconnects
    req.on("close", () => {
      sseManager.removeClient(res);
    });
  }
}

export default new DashboardController();
