/**
 * Traduz o erro de uma operação GraphQL na mensagem que o usuário vê.
 *
 * Erros de negócio já chegam prontos do backend, em português. Falhas de
 * rede, porém, vêm como "Failed to fetch" — texto do navegador, em inglês,
 * que não diz nada a quem está usando o app.
 */
const NETWORK_ERROR_PATTERN = /failed to fetch|networkerror|load failed|network request failed/i;

const NETWORK_ERROR_MESSAGE =
  "Não foi possível conectar ao servidor. Verifique sua conexão e se o backend está rodando.";

export function getErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof Error)) {
    return fallback;
  }

  if (NETWORK_ERROR_PATTERN.test(error.message)) {
    return NETWORK_ERROR_MESSAGE;
  }

  return error.message || fallback;
}

/** Código de negócio do erro GraphQL (VALIDATION_ERROR, NOT_FOUND, ...). */
export function getErrorCode(error: unknown): string | null {
  const errors = (error as { errors?: Array<{ extensions?: { code?: unknown } }> })?.errors;
  const code = errors?.[0]?.extensions?.code;

  return typeof code === "string" ? code : null;
}

/**
 * NOT_FOUND numa edição ou exclusão quase sempre significa que a tela está
 * olhando para um dado que não existe mais — outra aba apagou, ou a base
 * mudou por fora. Vale recarregar a lista em vez de deixar o usuário preso.
 */
export const STALE_DATA_MESSAGE =
  "Este item não existe mais. A lista foi atualizada.";
