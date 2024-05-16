import { Migration } from "../scripts/dbMigrate";

export const up: Migration = async (params) => {
  return params.context.query(`
    CREATE TABLE Users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(30) NOT NULL CHECK (length(name) >= 1 AND length(name) <= 30),
      email VARCHAR(30) UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
      age INTEGER CHECK (age > 0),
      role VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      password VARCHAR(255) NOT NULL CHECK (length(password) >= 8)
    );
  `);
};

export const down: Migration = async (params) => {
  return params.context.query(`DROP TABLE Users;`);
};
