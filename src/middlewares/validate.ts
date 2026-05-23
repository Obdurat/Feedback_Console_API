import { NextFunction, Request, Response } from "express";

import { ZodSchema } from "zod";

const validate =
  (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next({
        status: 400,

        message: result.error.issues.map((err) => err.message).join(", "),
      });
    }

    req.body = result.data;

    next();
  };

export default validate;
