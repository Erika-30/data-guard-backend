import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {
  createUser,
  validateUserCredentials,
} from "../../services/auth.service";
import { UserSchema } from "../../db/config/User";

const jwtSecret = process.env["JWT_SECRET"] || "your-secret-key";

export const validateUser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  console.log("validateUser DESDE AUTHcontroller.ts");
  console.log(req.body);
  const result = UserSchema.safeParse(req.body);
  if (!result.success) {
    return next({
      status: 400,
      message: "Validation Error",
      details: result.error.errors,
    });
  }
  req.body = result.data;
  next();
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("signup");
  try {
    console.log(req.body);
    const user = await createUser(req.body);
    console.log(user);
    res
      .status(201)
      .json({ ok: true, message: "User created successfully", data: user });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("login");
  console.log(req.body);
  console.log("login");
  try {
    const { email, password } = req.body;
    const user = await validateUserCredentials(email, password);
    const payload = { user: user.id };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
    res.json({ ok: true, message: "Login successful", token });
  } catch (error) {
    next(error);
  }
};
