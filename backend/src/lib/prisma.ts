import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

import { env } from "../env.js";
import { PrismaClient } from "../generated/prisma/client.js";

// O Prisma 7 exige um driver adapter para conectar ao banco.
const adapter = new PrismaBetterSqlite3({ url: env.databaseUrl });

export const prisma = new PrismaClient({ adapter });
