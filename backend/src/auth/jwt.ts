import jwt from "jsonwebtoken";

import { env } from "../env.js";

/**
 * Validade do token. Não há refresh token no escopo obrigatório: o
 * "Lembrar-me" da tela de login decide apenas ONDE o token é guardado
 * (localStorage x sessionStorage), não por quanto tempo ele vale.
 */
const TOKEN_EXPIRATION = "7d";

interface TokenPayload {
  sub: string;
}

export function signUserToken(userId: string): string {
  return jwt.sign({}, env.jwtSecret, {
    subject: userId,
    expiresIn: TOKEN_EXPIRATION,
  });
}

/**
 * Devolve o id do usuário quando o token é válido, ou null quando está
 * ausente, malformado, expirado ou assinado com outra chave.
 */
export function readUserIdFromToken(token: string): string | null {
  try {
    const payload = jwt.verify(token, env.jwtSecret) as TokenPayload;

    return payload.sub ?? null;
  } catch {
    return null;
  }
}

/** Extrai o token de um header no formato `Bearer <token>`. */
export function readBearerToken(authorizationHeader: string | undefined): string | null {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}
