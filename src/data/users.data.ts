import * as db from "../db/config/dbConfig";
import { User, UserData } from "../db/config/User";
import bcrypt from "bcrypt";

export async function createUserInDB(user: UserData): Promise<User> {
  if (!user.password || typeof user.password !== "string") {
    throw new Error("Invalid password");
  }

  if (!user.username || typeof user.username !== "string") {
    throw new Error("Invalid username");
  }

  if (!user.email || typeof user.email !== "string") {
    throw new Error("Invalid email");
  }

  if (!user.age || typeof user.age !== "number") {
    throw new Error("Invalid age");
  }

  if (!user.role || typeof user.role !== "string") {
    throw new Error("Invalid role");
  }

  const query = `
    INSERT INTO users (username, email, age, role, password)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const values = [
    user.username,
    user.email,
    user.age,
    user.role,
    hashedPassword,
  ];
  const result = await db.query(query, values);
  return result.rows[0];
}

export async function getUserByEmailFromDB(email: string): Promise<User> {
  console.log("getUserByEmailFromDB");
  if (!email || typeof email !== "string") {
    throw new Error("Invalid email");
  }

  const query = "SELECT * FROM users WHERE email = $1";
  const values = [email];
  const result = await db.query(query, values);
  return result.rows[0];
}
