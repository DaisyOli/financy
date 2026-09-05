import type { User } from "../generated/prisma/client.js";

import { NotFoundError } from "../errors/app-error.js";
import { prisma } from "../lib/prisma.js";
import { requireText } from "./validation.js";

/** Carrega o usuário autenticado. O id vem sempre do JWT, nunca do cliente. */
export async function findAuthenticatedUser(userId: string): Promise<User> {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new NotFoundError("Usuário não encontrado.");
  }

  return user;
}

/**
 * Atualiza apenas o nome. O e-mail é a identidade de login e não pode ser
 * alterado pelo perfil (CLAUDE.md seções 11.1 e 16.1) — por isso ele nem
 * existe no input desta operação.
 */
export async function updateProfileName(userId: string, name: string): Promise<User> {
  await findAuthenticatedUser(userId);

  return prisma.user.update({
    where: { id: userId },
    data: { name: requireText(name, "nome") },
  });
}
