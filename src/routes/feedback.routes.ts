import { Router } from "express";
import controllerWrapper from "../utils/controllerWrapper";
import validate from "../middlewares/validate";
import { createFeedbackSchema } from "../schemas/feedback.schema";
import feedbackController from "../controllers/feedback.controller";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware";

const MANAGEMENT_ROLES = ["Director", "Manager", "Team Manager", "Team Lead"];

const router = Router();

router.get(
  "/",
  requireRole(...MANAGEMENT_ROLES),
  controllerWrapper(feedbackController.getAll),
);
router.post(
  "/",
  requireRole(...MANAGEMENT_ROLES),
  validate(createFeedbackSchema),
  controllerWrapper(feedbackController.create),
);
router.patch("/:id/viewed", controllerWrapper(feedbackController.markAsViewed));

export default router;
