const TOKEN_KEY = "financy:token";

/**
 * "Lembrar-me" decide apenas ONDE o token fica:
 *   marcado    -> localStorage, sobrevive ao fechar o navegador
 *   desmarcado -> sessionStorage, morre com a aba
 *
 * Único ponto do app que toca em storage, para não espalhar acesso
 * direto pelas páginas (CLAUDE.md seção 37).
 */
export function readToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function saveToken(token: string, remember: boolean): void {
  try {
    clearToken();
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, token);
  } catch {
    // Navegador com storage bloqueado: a sessão vale só para esta página.
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // nada a fazer
  }
}
