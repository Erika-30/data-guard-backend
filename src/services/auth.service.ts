import { getUserByUsernameFromDB, createUserInDB } from "../data/users.data";
import bcrypt from "bcrypt";
import { User, UserData } from "../db/config/User";

export async function createUser(userData: UserData): Promise<User> {
  return await createUserInDB(userData);
}

export async function validateUserCredentials(
  username: string,
  password: string
): Promise<User> {
  const user = await getUserByUsernameFromDB(username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid username or password");
  }
  return user;
}
