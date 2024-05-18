import express from "express";

import { authMiddleware } from "../middlewares/authMiddleware";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import { uploadCsv } from "../controllers/uploadController";

const uploadRouter = express.Router();

uploadRouter.post("/upload", authMiddleware, upload.single("file"), uploadCsv);

export default uploadRouter;
