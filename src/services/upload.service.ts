import multer from "multer";
import path from "path";
import fs from "fs";
import csv from "csv-parser";
import { UserData, UserSchema } from "../db/config/User";
import { uploadUsers } from "../db/config/Uploads";

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Filtrar archivos por tipo (aceptar solo archivos CSV)
const fileFilter = (req: any, file: any, cb: any) => {
  const filetypes = /csv/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = file.mimetype === "text/csv";

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Only CSV files are allowed!");
  }
};

// Configuración de Multer
export const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: fileFilter,
}).single("csvFile");

// Función para procesar el archivo CSV y manejar la carga de usuarios
export const processCsvFile = (filePath: string) => {
  return new Promise<{ success: UserData[]; errors: any[] }>(
    (resolve, reject) => {
      const results: UserData[] = [];
      const errors: any[] = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data: any) => {
          const validationResult = UserSchema.safeParse(data);
          if (validationResult.success) {
            results.push(validationResult.data);
          } else {
            errors.push({
              row: results.length + 1,
              details: validationResult.error.errors.reduce(
                (acc: Record<string, string>, curr: any) => {
                  acc[curr.path[0]] = curr.message;
                  return acc;
                },
                {} as Record<string, string>
              ),
            });
          }
        })
        .on("end", () => {
          uploadUsers(results)
            .then(
              (result: {
                success: {
                  username: string;
                  email: string;
                  role: "user" | "admin";
                  password: string;
                  id?: number;
                  age?: number;
                  createdAt?: Date;
                  updatedAt?: Date;
                }[];
                errors: any[];
              }) => {
                resolve({
                  success: result.success,
                  errors: [...errors, ...result.errors],
                });
              }
            )
            .catch(reject);
        })
        .on("error", (err: any) => {
          reject(err);
        });
    }
  );
};
