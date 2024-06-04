//src/api/middlewares/userValidatorMiddleware.ts

import { Request, Response, NextFunction } from "express";
import { UserSchema } from "../../db/config/User";

export const userValidatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const result = UserSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      ok: false,
      errors: result.error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      })),
    });
  } else {
    req.body = result.data;
    next();
  }
};
