import express from "express";
import errorHandler from "./middlewares/errorHandler";
import teamRoutes from "./routes/team.routes";
import feedbackRoutes from "./routes/feedback.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import authRoutes from "./routes/auth.routes";
import { authMiddleware } from "./middlewares/auth.middleware";
import cors from "cors";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.middleware();
  }
  private middleware() {
    this.app.use(express.json());
    this.app.use(cors({ origin: "*" }));
    this.app.use("/auth", authRoutes);
    this.app.use("/team-members", authMiddleware, teamRoutes);
    this.app.use("/feedbacks", authMiddleware, feedbackRoutes);
    this.app.use("/dashboard", authMiddleware, dashboardRoutes);
    this.app.use((_req, res) => {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    });
    this.app.use(errorHandler);
  }
}

export default App;
