import { createUserInDB } from "../../data/users.data";
import { UserSchema, User, UserData } from "./User";

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
        console.log("user desde Upload", user);
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
