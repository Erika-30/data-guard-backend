import { Request, Response, NextFunction } from "express";
import { UserSchema } from "../../db/config/User";

export const validateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = UserSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ ok: false, error: result.error });
    return;
  }
  req.body = result.data;
  next();
};
