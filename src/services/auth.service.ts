import { getUserByEmailFromDB, createUserInDB } from "../data/users.data";
import bcrypt from "bcrypt";
import { User, UserData } from "../db/config/User";

export async function createUser(userData: UserData): Promise<User> {
  return await createUserInDB(userData);
}

export async function validateUserCredentials(
  email: string,
  password: string
): Promise<User> {
  const user = await getUserByEmailFromDB(email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    handleAuthenticationError();
  }
  return user;
}

function handleAuthenticationError(): never {
  throw new Error("Invalid username or password");
}
