import { Router } from "express";
import controllerWrapper from "../utils/controllerWrapper";
import teamController from "../controllers/team.controller";

const router = Router();

router.get("/", controllerWrapper(teamController.getAll));

export default router;
