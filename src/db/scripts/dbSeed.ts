import { configDotenv } from "dotenv";
import { query, pool } from "../config/dbConfig";

if (process.env["NODE_ENV"] === "test") {
  configDotenv({ path: ".env.test" });
} else {
  configDotenv();
}

query(`
  INSERT INTO Users (name, email, age, role, password)
  SELECT
    'User ' || s.id, -- Genera un nombre de usuario concatenando una cadena con el ID
    'user' || s.id || '@example.com', -- Genera un email basado en el ID
    ROUND((RANDOM() * (65 - 18)) + 18), -- Genera una edad aleatoria entre 18 y 65
    CASE 
        WHEN s.id % 2 = 0 THEN 'admin'
        ELSE 'user'
    END, -- Asigna roles de manera aleatoria
    '$2b$10$somethinghashed' -- Usa una contraseña hasheada por defecto
  FROM generate_series(1, 200) AS s(id);
`).then(() => {
  console.log("Users inserted");
  pool.end();
});
