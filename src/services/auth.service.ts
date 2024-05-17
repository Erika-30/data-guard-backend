// src/services/auth.service.ts
import { createUserInDB, getUserByEmailFromDB } from "../data/users.data";
import bcrypt from "bcrypt";
import { User, UserData } from "../db/config/User";

export async function createUser(userData: UserData): Promise<User> {
  console.log("Creating user... from auth.service.ts");
  return await createUserInDB(userData);
}

export async function validateUserCredentials(
  email: string,
  password: string
): Promise<User | null> {
  const user = await getUserByEmailFromDB(email);
  if (!user) {
    return null;
  }
  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return null;
  }
  return user;
}
