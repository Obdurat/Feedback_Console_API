import { Router } from "express";
import controllerWrapper from "../utils/controllerWrapper";
import dashboardController from "../controllers/dashboard.controller";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware";

const MANAGEMENT_ROLES = ["Director", "Manager", "Team Manager", "Team Lead"];

const router = Router();

router.get(
  "/stats",
  requireRole(...MANAGEMENT_ROLES),
  controllerWrapper(dashboardController.getStats),
);
router.get(
  "/feedbacks-by-category",
  requireRole(...MANAGEMENT_ROLES),
  controllerWrapper(dashboardController.getFeedbacksByCategory),
);
router.get(
  "/recent-feedbacks",
  requireRole(...MANAGEMENT_ROLES),
  controllerWrapper(dashboardController.getRecentFeedbacks),
);
router.get(
  "/top-members",
  requireRole(...MANAGEMENT_ROLES),
  controllerWrapper(dashboardController.getTopMembersByFeedback),
);

export default router;
