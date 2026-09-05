import "dotenv/config";

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // O mesmo default do .env.example. Existe para que `prisma generate`
    // (rodado no postinstall) funcione logo após o clone, antes de o .env
    // ser criado. A aplicação valida DATABASE_URL estritamente em src/env.ts.
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  },
});
