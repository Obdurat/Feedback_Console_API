import { Router } from "express";
import controllerWrapper from "../utils/controllerWrapper";
import teamController from "../controllers/team.controller";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware";
import validate from "../middlewares/validate";
import {
  createTeamMemberSchema,
  updateTeamMemberSchema,
} from "../schemas/team.schema";

const MANAGEMENT_ROLES = ["Director", "Manager", "Team Manager", "Team Lead"];

const router = Router();

router.get("/me/feedbacks", controllerWrapper(teamController.getMyFeedbacks));

// accessible by all authenticated users
router.get("/:id/feedbacks", controllerWrapper(teamController.getMyFeedbacks));

// management only
router.get(
  "/",
  requireRole(...MANAGEMENT_ROLES),
  controllerWrapper(teamController.getAll),
);
router.get(
  "/:id",
  requireRole(...MANAGEMENT_ROLES),
  controllerWrapper(teamController.getById),
);
router.post(
  "/",
  requireRole(...MANAGEMENT_ROLES),
  validate(createTeamMemberSchema),
  controllerWrapper(teamController.create),
);
router.patch(
  "/:id",
  requireRole(...MANAGEMENT_ROLES),
  validate(updateTeamMemberSchema),
  controllerWrapper(teamController.update),
);
router.delete(
  "/:id",
  requireRole(...MANAGEMENT_ROLES),
  controllerWrapper(teamController.remove),
);

export default router;
