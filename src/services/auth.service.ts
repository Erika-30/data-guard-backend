// src/services/auth.service.ts

import { getUserByEmailFromDB, createUserInDB } from "../data/users.data";
import bcrypt from "bcrypt";
import { User, UserData } from "../db/config/User";

export async function createUser(userData: UserData): Promise<User> {
  const user = await getUserByEmailFromDB(userData.email);

  if (user !== undefined) {
    throw new Error("Email already in use");
  }

  console.log(`Password: ${userData.password}`);

  userData.password = await bcrypt.hash(userData.password, 10);

  console.log(`Password: ${userData.password}`);
  return await createUserInDB(userData);
}

export async function validateUserCredentials(
  email: string,
  password: string
): Promise<User> {
  const user = await getUserByEmailFromDB(email);

  if (!user) {
    console.log(`No user found with email: ${email}`);
    throw new Error("Usuario no encontrado");
  }

  console.log(`Password: ${password}`);
  console.log(`Password: ${user.password}`);

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    console.log(`Invalid password for user with email: ${email}`);
    throw new Error("Invalid password");
  }

  console.log(`User ${email} logged in successfully`);
  return user;
}
