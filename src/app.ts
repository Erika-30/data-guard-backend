import express from "express";
import { config as configDotenv } from "dotenv";
import authRouter from "./api/routes/authRoutes";
import uploadRouter from "./api/routes/uploadRoutes";

if (process.env["NODE_ENV"] === "test") {
  configDotenv({ path: ".env.test" });
} else {
  configDotenv();
}

export const app = express();

app.use(express.json());

app.use("/auth", authRouter);
app.use("/upload", uploadRouter);

export default app;
