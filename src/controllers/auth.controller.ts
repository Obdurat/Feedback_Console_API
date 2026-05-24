import { Request, Response } from "express";
import authService from "../services/auth.service";

class AuthController {
  async initLogin(req: Request, res: Response) {
    const { employeeCode } = req.body;
    console.log("Received initLogin request for employeeCode:", employeeCode);
    const result = await authService.initLogin(employeeCode);
    return res.json(result);
  }

  async verifyTotp(req: Request, res: Response) {
    const { memberId, code } = req.body;
    const result = await authService.verifyTotp(memberId, code);
    return res.json(result);
  }
}

export default new AuthController();
