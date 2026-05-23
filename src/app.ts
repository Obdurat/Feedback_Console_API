import express from "express";
import errorHandler from "./middlewares/errorHandler";
import router from "./routes/team.routes";
import cors from "cors";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.middleware();
  }
  private middleware() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(router);
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
