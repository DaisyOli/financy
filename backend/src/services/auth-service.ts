import bcrypt from "bcryptjs";
import type { User } from "../generated/prisma/client.js";

import { signUserToken } from "../auth/jwt.js";
import { ConflictError, ValidationError } from "../errors/app-error.js";
import { prisma } from "../lib/prisma.js";
import { normalizeEmail, requireText, validatePassword } from "./validation.js";

const SALT_ROUNDS = 10;

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  token: string;
  user: User;
}

export async function register(input: RegisterInput): Promise<User> {
  const name = requireText(input.name, "nome");
  const email = normalizeEmail(input.email);
  const password = validatePassword(input.password);

  const alreadyExists = await prisma.user.findUnique({ where: { email } });

  if (alreadyExists) {
    throw new ConflictError("Já existe uma conta com este e-mail.");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  return prisma.user.create({ data: { name, email, passwordHash } });
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const email = normalizeEmail(input.email);
  const password = input.password ?? "";

  const user = await prisma.user.findUnique({ where: { email } });

  // Mensagem única para e-mail inexistente e senha errada: não revela
  // quais e-mails estão cadastrados.
  const invalidCredentials = new ValidationError("E-mail ou senha inválidos.");

  if (!user) {
    throw invalidCredentials;
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw invalidCredentials;
  }

  return { token: signUserToken(user.id), user };
}
