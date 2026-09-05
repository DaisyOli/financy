import type { IncomingMessage } from "node:http";

import { readBearerToken, readUserIdFromToken } from "../auth/jwt.js";

export interface GraphQLContext {
  /** Id do usuário autenticado, ou undefined em requisições anônimas. */
  userId?: string;
}

/**
 * Um token ausente ou inválido não derruba a requisição: o contexto apenas
 * fica anônimo. São as operações protegidas que rejeitam, via requireUser.
 */
export function createContext(req: IncomingMessage): GraphQLContext {
  const token = readBearerToken(req.headers.authorization);

  if (!token) {
    return {};
  }

  const userId = readUserIdFromToken(token);

  return userId ? { userId } : {};
}
