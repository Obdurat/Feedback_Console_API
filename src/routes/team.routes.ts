import { Router } from "express";
import controllerWrapper from "../utils/controllerWrapper";
import teamController from "../controllers/team.controller";
import {
  createTeamMemberSchema,
  updateTeamMemberSchema,
} from "../schemas/team.schema";
import validate from "../middlewares/validate";

const router = Router();

router.get("/", controllerWrapper(teamController.getAll));
router.get("/:id", controllerWrapper(teamController.getById));

router.post(
  "/",
  validate(createTeamMemberSchema),
  controllerWrapper(teamController.create),
);

router.patch(
  "/:id",
  validate(updateTeamMemberSchema),
  controllerWrapper(teamController.update),
);

router.delete("/:id", controllerWrapper(teamController.remove));

export default router;
