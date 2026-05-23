import { ErrorRequestHandler, Request, Response } from "express";

const errorHandler: ErrorRequestHandler = (
  err,
  _req: Request,
  res: Response,
  _next,
) => {
  const status = err.status || 500;

  const message = err.message || "Internal server error";

  return res.status(status).json({
    success: false,
    message,
  });
};

export default errorHandler;
