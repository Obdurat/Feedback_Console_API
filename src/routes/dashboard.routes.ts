import { Router } from "express";
import controllerWrapper from "../utils/controllerWrapper";
import dashboardController from "../controllers/dashboard.controller";

const router = Router();

router.get("/stats", controllerWrapper(dashboardController.getStats));
router.get(
  "/feedbacks-by-category",
  controllerWrapper(dashboardController.getFeedbacksByCategory),
);
router.get(
  "/recent-feedbacks",
  controllerWrapper(dashboardController.getRecentFeedbacks),
);
router.get(
  "/top-members",
  controllerWrapper(dashboardController.getTopMembersByFeedback),
);

export default router;
