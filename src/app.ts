import express from "express";
import { config as configDotenv } from "dotenv";
import authRouter from "./api/routes/authRoutes";
import { errorMiddleware } from "./api/middlewares/errorMiddleware";
import uploadRouter from "./api/routes/uploadRoutes";

if (process.env["NODE_ENV"] === "test") {
  configDotenv({ path: ".env.test" });
} else {
  configDotenv();
}

export const app = express();

const cors = require("cors");

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//   })
// );

app.use(cors());

app.use(express.json());

app.use("/auth", authRouter);
app.use("/user", uploadRouter);

app.use(errorMiddleware);

export default app;
