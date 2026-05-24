import { Router } from "express";
import controllerWrapper from "../utils/controllerWrapper";
import validate from "../middlewares/validate";
import { loginSchema } from "../schemas/auth.schema";
import authController from "../controllers/auth.controller";

const router = Router();

router.post(
  "/login",
  validate(loginSchema),
  controllerWrapper(authController.login),
);

export default router;
