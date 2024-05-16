import { configDotenv } from "dotenv";
import { query, pool } from "../config/dbConfig";

if (process.env["NODE_ENV"] === "test") {
  configDotenv({ path: ".env.test" });
} else {
  configDotenv();
}

query(`
  INSERT INTO users (username, password, email, firstname, lastname, role)
  VALUES
    ('admin', '$2b$10$somethinghashed', 'admin@example.com', 'Admin', 'User', 'admin'),
    ('user', '$2b$10$somethinghashed', 'user@example.com', 'Normal', 'User', 'user');
`).then(() => {
  console.log("Users inserted");
  pool.end();
});
