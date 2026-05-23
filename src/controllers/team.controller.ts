import { Request, Response } from "express";
import teamService from "../services/team.service";
import { getMembersQuerySchema } from "../schemas/get-members-query.schema";

class TeamController {
  async getAll(req: Request, res: Response) {
    const query = getMembersQuerySchema.parse(req.query);
    const members = await teamService.getAll(query);

    return res.json(members);
  }
}

export default new TeamController();
