// src/db/template/migration-template.ts

import { Migration } from "../dbMigrate";

export const up: Migration = async ({ context }) => {
  const sqlQuery = `
    -- Aquí va tu consulta SQL para la migración 'up'
  `;
  await context.query(sqlQuery);
};

export const down: Migration = async ({ context }) => {
  const sqlQuery = `
    -- Aquí va tu consulta SQL para la migración 'down'
  `;
  await context.query(sqlQuery);
};
