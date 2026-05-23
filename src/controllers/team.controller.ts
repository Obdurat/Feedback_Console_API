import { Request, Response } from "express";
import teamService from "../services/team.service";

class TeamController {
  async getAll(_req: Request, res: Response) {
    const members = await teamService.getAll();

    return res.json(members);
  }
}

export default new TeamController();
