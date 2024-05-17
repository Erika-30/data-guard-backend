import * as db from "../db/config/dbConfig";
import bcrypt from "bcrypt";
import { User, UserData, UserSchema } from "../db/config/User";

// Function to validate and insert users into the database
export async function uploadUsers(
  data: UserData[]
): Promise<{ success: User[]; errors: any[] }> {
  const success: User[] = [];
  const errors: any[] = [];

  for (const [index, user] of data.entries()) {
    const validationResult = UserSchema.safeParse(user);
    if (validationResult.success) {
      try {
        const createdUser = await createUserInDB(user);
        success.push(createdUser);
      } catch (error: any) {
        errors.push({
          row: index + 1,
          details: { general: error.message },
        });
      }
    } else {
      const details = validationResult.error.errors.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {} as Record<string, string>);
      errors.push({
        row: index + 1,
        details,
      });
    }
  }

  return { success, errors };
}

async function createUserInDB(user: UserData): Promise<User> {
  const query = `
    INSERT INTO users (username, email, age, role, password)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, username, email, age, role, createdAt, updatedAt;
  `;
  const hashedPassword = user.password
    ? await bcrypt.hash(user.password, 10)
    : "";
  const unfilteredQueryParams: (string | number | undefined)[] = [
    user.username,
    user.email,
    user.age,
    user.role,
    hashedPassword,
  ];
  const queryParams: (string | number | boolean | null)[] =
    unfilteredQueryParams.filter((param) => param !== undefined) as (
      | string
      | number
      | boolean
      | null
    )[];
  const result = await db.query(query, queryParams);
  return result.rows[0];
}
