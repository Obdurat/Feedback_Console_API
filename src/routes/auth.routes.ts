import { Router } from "express";
import controllerWrapper from "../utils/controllerWrapper";
import validate from "../middlewares/validate";
import { changePasswordSchema, loginSchema } from "../schemas/auth.schema";
import authController from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/login",
  validate(loginSchema),
  controllerWrapper(authController.login),
);

router.post(
  "/change-password",
  authMiddleware,
  validate(changePasswordSchema),
  controllerWrapper(authController.changePassword),
);

export default router;
