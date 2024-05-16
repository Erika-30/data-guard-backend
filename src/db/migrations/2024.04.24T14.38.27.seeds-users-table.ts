// src/db/migrations/2024.04.24T14.38.27.seeds-users-table.ts
import { Migration } from "../scripts/dbMigrate";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

export type User = {
  name: string;
  email: string;
  age: number;
  role: string;
  password: string;
};

const roles = ["user", "admin"];

export function generateUser(): User {
  const name = faker.person.fullName();
  const email = faker.internet.email();
  const age = Number(faker.number.int({ min: 18, max: 65 }));
  const role = faker.helpers.arrayElement(roles);
  const password = "!Aa0" + faker.internet.httpMethod();

  return {
    name,
    email,
    age,
    role,
    password,
  };
}

export const up: Migration = async (params) => {
  const users: User[] = [];
  for (let i = 0; i < 15; i++) {
    users.push(generateUser());
  }

  // Hash passwords before inserting into the database
  const usersWithHashedPasswords = await Promise.all(
    users.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10),
    }))
  );

  const values = usersWithHashedPasswords
    .map(
      (user) =>
        `('${user.name}', '${user.email}', ${user.age}, '${user.role}', '${user.password}')`
    )
    .join(", ");
  const sqlQuery = `INSERT INTO users (name, email, age, role, password) VALUES ${values};`;

  return await params.context.query(sqlQuery);
};

export const down: Migration = async (params) => {
  return params.context.query(`DELETE FROM users;`);
};
