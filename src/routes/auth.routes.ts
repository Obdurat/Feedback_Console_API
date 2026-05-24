import { Router } from "express";
import controllerWrapper from "../utils/controllerWrapper";
import validate from "../middlewares/validate";
import { initLoginSchema, verifyTotpSchema } from "../schemas/auth.schema";
import authController from "../controllers/auth.controller";

const router = Router();

router.post(
  "/init",
  validate(initLoginSchema),
  controllerWrapper(authController.initLogin),
);
router.post(
  "/verify",
  validate(verifyTotpSchema),
  controllerWrapper(authController.verifyTotp),
);

export default router;
