import { Migration } from "../scripts/dbMigrate";

export const up: Migration = async (params) => {
  return params.context.query(`
    CREATE TABLE Users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(30) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(30) UNIQUE,
      firstname VARCHAR(30),
      lastname VARCHAR(30),
      role VARCHAR(10) NOT NULL DEFAULT 'user',
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export const down: Migration = async (params) => {
  return params.context.query(`DROP TABLE Users;`);
};
