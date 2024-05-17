import { Router } from "express";
import { uploadCsv } from "../controllers/uploadController";
import { authMiddleware } from "../middlewares/authMiddleware";

const uploadRouter = Router();

uploadRouter.post("/", authMiddleware, uploadCsv);

export default uploadRouter;
