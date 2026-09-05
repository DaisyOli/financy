import "dotenv/config";

const DEFAULT_PORT = 3333;
const DEFAULT_FRONTEND_URL = "http://localhost:5173";

function readPort(): number {
  const raw = process.env.PORT;

  if (!raw) {
    return DEFAULT_PORT;
  }

  const parsed = Number(raw);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid PORT environment variable: "${raw}"`);
  }

  return parsed;
}

function readRequired(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing ${name} environment variable. Copy .env.example to .env and fill it in.`,
    );
  }

  return value;
}

export const env = {
  port: readPort(),
  frontendUrl: process.env.FRONTEND_URL ?? DEFAULT_FRONTEND_URL,
  databaseUrl: readRequired("DATABASE_URL"),
  jwtSecret: readRequired("JWT_SECRET"),
};
