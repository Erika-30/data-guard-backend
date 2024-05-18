import { Response, Request } from "express";
import csv from "csv-parser"; // csv hace referencia a la librería csv-parser que se encarga de leer archivos CSV, si luego se quiere transformar a un objeto JSON se puede usar JSON.stringify y si luego se quiere transformar a un objeto js se puede usar JSON.parse. si de forma directa se quiere transformar de csv a objeto js se puede usar la librería csvtojson y luego se puede usar JSON.parse
import { PassThrough } from "stream";
import { UserDto, UserSchema } from "../../db/config/User";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const uploadCsv = (req: MulterRequest, res: Response, err: any) => {
  if (!req.file) {
    return res.status(400).json({ ok: false, message: "No file uploaded" });
  }

  if (!req.file) {
    return res.status(400).send({
      status: false,
      message: "No se ha subido ningún archivo",
    });
  }

  // esperado
  const userListOk: UserDto[] = [];

  // esperado
  const userLisFail: UserDto[] = [];

  // esperado
  const userListErrors: any[] = [];

  const results: any[] = [];
  const bufferStream = new PassThrough();
  bufferStream.end(req.file.buffer);

  let rowNumber = 0;

  return bufferStream
    .pipe(
      csv({
        separator: ";",
        mapValues: ({ header, index, value }) => {
          if (header === "age") return parseInt(value);
          return value;
        },
      })
    )
    .on("data", (data) => results.push(data))
    .on("data", (data) => {
      rowNumber++;
      data.rowNumber = rowNumber;

      const userData = new UserDto();
      userData.username = data.username;
      userData.email = data.email;
      userData.age = data.age;
      userData.role = data.role;
      userData.password = data.password;

      console.log(userData);

      let rs = validateUsers(userData);
      if (!rs.success) {
        userLisFail.push(userData);

        rs.error.errors.forEach((error) => {
          userListErrors.push({
            row: results.length,
            details: { [error.path[0]]: error.message },
          });
        });
      } else {
        userListOk.push(userData);
      }
    })
    .on("end", () => {
      res.send({
        status: true,
        message: "Archivo CSV leído correctamente",
        data: {
          success: userListOk,
          errors: userLisFail,
        },
      });
    })
    .on("error", (error) => {
      return res.status(500).send({
        status: false,
        message: "Error al leer el archivo CSV" + error.message,
      });
    });
};

export const validateUsers = (user: any) => {
  const result = UserSchema.safeParse(user);
  if (!result.success) {
    console.log("rrrrrrrrrrrrrrrrr");
    console.log(result.error.errors);
  }
  return result;
};

export class UserDtoRow {
  row?: number;
  details!: UserDto;
}
