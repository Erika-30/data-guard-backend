import { Request, Response } from "express";

export const uploadFile = (req: Request, res: Response) => {
  try {
    // req.file es el `file` que se subió
    // req.body contendrá los campos de texto, si los hubiera
    console.log(req.file);

    res.status(200).json({
      message: "File uploaded successfully",
      file: req.file,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "An error occurred while uploading the file",
    });
  }
};
