import { Request, Response } from "express";
import authService from "../services/auth.service";

class AuthController {
  async login(req: Request, res: Response) {
    const { employeeCode, password } = req.body;
    const result = await authService.login(employeeCode, password);
    return res.json(result);
  }
}

export default new AuthController();
