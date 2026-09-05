import { UnauthenticatedError } from "../errors/app-error.js";
import type { GraphQLContext } from "../graphql/context.js";

/**
 * Guard das operações protegidas. Toda query/mutation que toca dados de
 * usuário deve obter o id por aqui — nunca a partir de argumentos vindos
 * do cliente, que não são confiáveis.
 */
export function requireUser(context: GraphQLContext): string {
  if (!context.userId) {
    throw new UnauthenticatedError();
  }

  return context.userId;
}
