import { Router } from "express";
import { validateUser, signup, login } from "../controllers/authController";

const authRouter = Router();

authRouter.post("/signup", validateUser, signup);
authRouter.post("/login", login);

export default authRouter;
