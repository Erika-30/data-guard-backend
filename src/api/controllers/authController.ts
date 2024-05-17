import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {
  createUser,
  validateUserCredentials,
} from "../../services/auth.service";
import { jwtSecret } from "../../config/jwtConfig";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body);
    console.log("Creating user...");
    const user = await createUser(req.body);
    res
      .status(201)
      .json({ ok: true, message: "User created successfully", data: user });
  } catch (error) {
    next(error);
  }
};

// rout post /login
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await validateUserCredentials(email, password);
    if (!user) {
      res.status(401).json({ ok: false, message: "Invalid credentials" });
      return;
    }
    const payload = { user };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
    res.json({ ok: true, message: "Login successful", token });
  } catch (error) {
    next(error);
  }
};
