import { Migration } from "../scripts/dbMigrate";

import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

export type User = {
  username: string;
  email: string;
  age: number;
  role: string;
  password: string;
};

const roles = ["user", "admin"];

export function generateUser(): User {
  const username = faker.person.fullName();
  const email = faker.internet.email();
  const age = Number(faker.number.int({ min: 18, max: 65 }));
  const role = faker.helpers.arrayElement(roles);
  const password = "!Aa0" + faker.internet.httpMethod();

  return {
    username,
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

  const usersWithHashedPasswords = await Promise.all(
    users.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10),
    }))
  );

  for (const user of usersWithHashedPasswords) {
    const sqlQuery = `INSERT INTO users (username, email, age, role, password) VALUES ($1, $2, $3, $4, $5);`;
    await params.context.query(sqlQuery, [
      user.username,
      user.email,
      user.age,
      user.role,
      user.password,
    ]);
  }
};

export const down: Migration = async (params) => {
  return params.context.query(`DELETE FROM users;`);
};
