import { config as configDotenv } from "dotenv";
import { Client, Pool } from "pg";

if (process.env["NODE_ENV"] === "test") {
  configDotenv({ path: ".env.test" });
} else {
  configDotenv();
}

const { PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD, PGADMINDATABASE } =
  process.env;

if (
  !PGHOST ||
  !PGPORT ||
  !PGDATABASE ||
  !PGUSER ||
  !PGPASSWORD ||
  !PGADMINDATABASE
) {
  throw new Error("Required environment variables are not defined");
}

export const pool = new Pool({
  host: PGHOST,
  port: Number(PGPORT),
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
});

export const query = async (
  text: string,
  params?: (string | number | boolean | null)[]
) => {
  try {
    const results = await pool.query(text, params);
    return results;
  } catch (error) {
    console.error(`Error executing query: ${text}`, error);
    throw error;
  }
};

export const adminClient = new Client({
  host: PGHOST,
  port: Number(PGPORT),
  database: PGADMINDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
});

adminClient.connect().catch((error) => {
  console.error("Error connecting to admin database", error);
  process.exit(1);
});

// Use adminClient for admin operations and then disconnect
// adminClient.query('YOUR_ADMIN_OPERATION').finally(() => adminClient.end());
