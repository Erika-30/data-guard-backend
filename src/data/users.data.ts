import * as db from "../db/config/dbConfig";
import { User, UserData } from "../db/config/User";

export async function createUserInDB(user: UserData): Promise<User> {
  const query = `
    INSERT INTO users (username, email, age, role, password)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const values: (string | number | boolean | null)[] = [
    user.username,
    user.email,
    user.age == undefined ? null : user.age,
    user.role,
    user.password,
  ];
  const result = await db.query(query, values);
  return result.rows[0];
}

export async function getUserByEmailFromDB(email: string): Promise<User> {
  const query = "SELECT * FROM users WHERE email = $1";
  const values = [email];
  const result = await db.query(query, values);
  return result.rows[0];
}
