import { Router } from "express";

import controllerWrapper from "../utils/controllerWrapper";

import validate from "../middlewares/validate";

import { createFeedbackSchema } from "../schemas/feedback.schema";

import feedbackController from "../controllers/feedback.controller";

const router = Router();

router.post(
  "/",

  validate(createFeedbackSchema),

  controllerWrapper(feedbackController.create),
);

router.get("/", controllerWrapper(feedbackController.getAll));

export default router;
