import * as db from "../db/config/dbConfig";
import { User, UserData } from "../db/config/User";
import bcrypt from "bcrypt";

export async function createUserInDB(user: UserData): Promise<User> {
  const query =
    "INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4) RETURNING *";
  const hashedPassword = user.password
    ? await bcrypt.hash(user.password, 10)
    : "";
  const queryParams: (string | number | boolean)[] = [
    user.name,
    hashedPassword,
    user.email || "",
    user.role || "user",
  ];
  const result = await db.query(query, queryParams);
  return result.rows[0];
}

export async function getUserByUsernameFromDB(username: string): Promise<User> {
  const query = "SELECT * FROM users WHERE username = $1";
  const queryParams = [username];
  const result = await db.query(query, queryParams);
  return result.rows[0];
}
