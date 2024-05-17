import { Router } from "express";
import { uploadCsv } from "../controllers/uploadController";

const uploadRouter = Router();
uploadRouter.post("/upload", uploadCsv);

export default uploadRouter;
