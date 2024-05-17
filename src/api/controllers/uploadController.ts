import { Request, Response, NextFunction } from "express";
const multer = require("multer");
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { upload, processCsvFile } from "../../services/upload.service";

interface MulterRequest extends Request {
  file?: File;
}

export const uploadCsv = (
  req: MulterRequest,
  res: Response,
  next: NextFunction
) => {
  upload(req, res, async (err: any): Promise<any> => {
    if (err) {
      console.error(err);
      return res.status(500).json({ ok: false, message: "Upload failed" });
    }

    if (!req.file) {
      return res.status(400).json({ ok: false, message: "No file uploaded" });
    }

    try {
      const { success, errors } = await processCsvFile(req.file.path);
      res.status(200).json({ ok: true, data: { success, errors } });
    } catch (error) {
      next(error);
    }
  });
};
