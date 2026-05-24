import { Request, Response } from "express";
import teamService from "../services/team.service";
import { getMembersQuerySchema } from "../schemas/get-members-query.schema";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

class TeamController {
  async getAll(req: Request, res: Response) {
    const query = getMembersQuerySchema.parse(req.query);
    const members = await teamService.getAll(query);

    return res.json(members);
  }

  async getById(req: Request, res: Response) {
    const member = await teamService.getById(req.params.id as string);
    return res.json(member);
  }

  async create(req: Request, res: Response) {
    const member = await teamService.create(req.body);
    return res.status(201).json(member);
  }

  async update(req: Request, res: Response) {
    const member = await teamService.update(req.params.id as string, req.body);
    return res.json(member);
  }

  async remove(req: Request, res: Response) {
    await teamService.remove(req.params.id as string);
    return res.status(204).send();
  }

  async getMyFeedbacks(req: AuthenticatedRequest, res: Response) {
    const result = await teamService.getMyFeedbacks(req.user!.id);
    return res.json(result);
  }

  async resetTotp(req: Request, res: Response) {
    const member = await teamService.resetTotp(req.params.id as string);
    return res.json(member);
  }
}

export default new TeamController();
