import multer from "multer";
import path from "path";
import fs from "fs";
import csv from "csv-parser";
import { createUserInDB } from "../data/users.data";
import { User, UserData, UserSchema } from "../db/config/User";

// Configuración de almacenamiento de Multer
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Filtrar archivos por tipo
const fileFilter = (req: any, file: any, cb: any) => {
  const filetypes = /csv/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Only CSV files are allowed!");
  }
};

// Configuración de Multer
export const upload = multer({
  storage: multerStorage,
  limits: { fileSize: 1000000 },
  fileFilter: fileFilter,
}).single("csvFile");

// Function to validate and insert users into the database
export async function uploadUsers(
  data: UserData[]
): Promise<{ success: User[]; errors: any[] }> {
  const success: User[] = [];
  const errors: any[] = [];

  for (const [index, user] of data.entries()) {
    const validationResult = UserSchema.safeParse(user);
    if (validationResult.success) {
      try {
        const createdUser = await createUserInDB(user);
        success.push(createdUser);
      } catch (error: any) {
        errors.push({
          row: index + 1,
          details: { general: error.message },
        });
      }
    } else {
      const details = validationResult.error.errors.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {} as Record<string, string>);
      errors.push({
        row: index + 1,
        details,
      });
    }
  }

  return { success, errors };
}
