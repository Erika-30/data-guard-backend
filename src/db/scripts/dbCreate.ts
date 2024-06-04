// src/db/scripts/dbCreate.ts

import { config as configDotenv } from "dotenv";
import { Client } from "pg";

// Load environment variables based on the environment
if (process.env["NODE_ENV"] === "test") {
  configDotenv({ path: ".env.test" });
} else {
  configDotenv();
}

// Database name from environment variables
const dbName = process.env["PGDATABASE"];

// SQL query to create the users table if it doesn't exist
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(30) UNIQUE NOT NULL,
    age INTEGER,
    role VARCHAR(30) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    password VARCHAR(255) NOT NULL
  );
`;

// Function to create the database and table
async function createDatabaseAndTable() {
  // Connect to the default 'postgres' database to create the new database
  const adminClient = new Client({
    user: process.env["PGUSER"],
    host: process.env["PGHOST"],
    database: "postgres", // Connect to the default 'postgres' database
    password: process.env["PGPASSWORD"],
    port: parseInt(process.env["PGPORT"] || "5432"),
  });

  await adminClient.connect();

  try {
    // Create the database if it doesn't exist
    await adminClient.query(`CREATE DATABASE "${dbName}"`);
    console.log(`Base de datos "${dbName}" creada exitosamente`);
  } catch (err: any) {
    // If the error is that the database already exists, we can ignore it
    if (err.code === "42P04") {
      console.log(`Base de datos "${dbName}" ya existe`);
    } else {
      console.error("Error al crear la base de datos", err.stack);
      throw err;
    }
  } finally {
    await adminClient.end();
  }

  // Connect to the newly created database to create the table
  const dbClient = new Client({
    user: process.env["PGUSER"],
    host: process.env["PGHOST"],
    database: dbName,
    password: process.env["PGPASSWORD"],
    port: parseInt(process.env["PGPORT"] || "5432"),
  });

  await dbClient.connect();

  try {
    // Create the users table
    await dbClient.query(createTableQuery);
    console.log("Tabla 'users' creada exitosamente");
  } catch (err) {
    console.error("Error al crear la tabla", (err as Error).stack);
    throw err;
  } finally {
    await dbClient.end();
  }
}

// Execute the function
createDatabaseAndTable().catch((err) => {
  console.error(
    "Error al ejecutar el script de creación de base de datos y tabla:",
    err
  );
});
