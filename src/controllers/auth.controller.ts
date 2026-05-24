import { Request, Response } from "express";
import authService from "../services/auth.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

class AuthController {
  async login(req: Request, res: Response) {
    const { employeeCode, password } = req.body;
    const result = await authService.login(employeeCode, password);
    return res.json(result);
  }

  async changePassword(req: AuthenticatedRequest, res: Response) {
    const { newPassword } = req.body;
    await authService.changePassword(req.user!.id, newPassword);
    return res.json({ message: "Password changed successfully" });
  }
}

export default new AuthController();
