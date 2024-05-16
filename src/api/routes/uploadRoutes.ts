import express from "express";
import multer from "multer";
import { uploadFile } from "../controllers/uploadController";

const router = express.Router();

// Configuración de Multer
const storage = multer.diskStorage({
  destination: function (_req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (_req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // Rechaza un archivo
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limita el tamaño del archivo a 5MB
  },
  fileFilter: fileFilter,
});

// Ruta para subir archivos
router.post("/", upload.single("file"), uploadFile);

export default router;
