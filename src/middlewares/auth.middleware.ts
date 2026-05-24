import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import CustomError from "../utils/customError";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    employeeCode: string;
    role: string;
  };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) => {
  const token =
    req.headers.authorization?.split(" ")[1] || (req.query.token as string);

  if (!token) {
    return next(
      new CustomError("Missing or invalid authorization header", 401),
    );
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as AuthenticatedRequest["user"];
    req.user = decoded;
    next();
  } catch {
    next(new CustomError("Invalid or expired token", 401));
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new CustomError("Forbidden: insufficient permissions", 403));
    }
    next();
  };
};
