// src/db/config/User.ts

import { z } from "zod";

export const UserSchema = z.object({
  id: z.number().optional(),
  username: z
    .string()
    .min(1, "El nombre es requerido")
    .max(30, "El nombre no puede exceder los 30 caracteres")
    .regex(/^[a-zA-Z ]*$/, "El nombre solo puede contener letras y espacios"),
  email: z
    .string()
    .email("Debe ser un email válido")
    .max(30, "El email no puede exceder los 30 caracteres"),
  age: z.number().positive("La edad debe ser un número positivo").optional(),
  role: z
    .string()
    .refine((value) => /^user$|^admin$/.test(value), {
      message: "Role must be 'user' or 'admin'",
    })
    .default("user"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export type User = z.infer<typeof UserSchema>;

export type UserData = Omit<User, "id" | "createdAt" | "updatedAt"> & {
  password?: string;
};

export class UserDto {
  username!: string;
  email!: string;
  age?: number;
  role!: string;
  password!: string;
}
