// src/data/users.data.ts

import * as db from "../db/config/dbConfig";
import { User, UserData } from "../db/config/User";
import bcrypt from "bcrypt";

export async function createUserInDB(user: UserData): Promise<User> {
  const query =
    "INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4) RETURNING *";
  const hashedPassword =
    user.password && typeof user.password === "string"
      ? await bcrypt.hash(user.password, 10)
      : "";
  const queryParams: (string | number | boolean)[] = [
    user.username || "",
    hashedPassword,
    user.email || "",
    user.role || "user",
  ];
  const result = await db.query(query, queryParams);
  return result.rows[0];
}

export async function getUserByEmailFromDB(email: string): Promise<User> {
  const query = "SELECT * FROM users WHERE email = $1";
  const queryParams = [email];
  const result = await db.query(query, queryParams);
  return result.rows[0];
}
