import { Request, Response, NextFunction, RequestHandler } from "express";

const controllerWrapper = (func: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next);
    } catch (error) {
      console.error("Error in controller:", error);
      next(error);
    }
  };
};

export default controllerWrapper;
