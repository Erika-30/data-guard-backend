import { Request, Response, NextFunction } from "express";
import fs from "fs";
import csv from "csv-parser";
import { upload, uploadUsers } from "../../services/upload.service";
import { UserData } from "../../db/config/User";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const uploadCsv = (
  req: MulterRequest,
  res: Response,
  next: NextFunction
) => {
  upload(req, res, (err: any) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ ok: false, message: "Upload failed" });
    }

    if (!req.file) {
      return res.status(400).json({ ok: false, message: "No file uploaded" });
    }

    const results: UserData[] = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          const { success, errors } = await uploadUsers(results);
          res.status(200).json({ ok: true, data: { success, errors } });
        } catch (error) {
          next(error);
        }
      });
  });
};
