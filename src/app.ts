import express from "express";
import { config as configDotenv } from "dotenv";
import authRouters from "./api/routes/authRoutes";
// import uploadRouters from "./api/routes/uploadRoutes";

if (process.env["NODE_ENV"] === "test") {
  configDotenv({ path: ".env.test" });
} else {
  configDotenv();
}

export const app = express();

app.use(express.json());

app.use("/auth", authRouters);
// app.use("/upload", uploadRouters);

export default app;
