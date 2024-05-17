import { Router } from "express";
import { signup, login } from "../controllers/authController";
import { validateUser } from "../middlewares/userValidator";

const authRouter = Router();
authRouter.post("/signup", validateUser, signup);
authRouter.post("/login", login);

export default authRouter;
