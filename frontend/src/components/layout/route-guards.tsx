import type { ReactNode } from "react";

import { useAuth } from "../../contexts/auth-context";
import { LoginPage } from "../../pages/login";

/** Estado neutro enquanto a sessão guardada é revalidada. */
function SessionLoading() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-gray-100">
      <p className="text-gray-500">Carregando...</p>
    </div>
  );
}

/**
 * A raiz tem comportamento duplo exigido pelo desafio (CLAUDE.md seção 21):
 * deslogado mostra o Login, logado mostra o conteúdo protegido.
 */
export function RootRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <SessionLoading />;

  return isAuthenticated ? <>{children}</> : <LoginPage />;
}

/**
 * Demais rotas privadas. Sem sessão, cai na tela de login em vez de
 * redirecionar, para a URL digitada continuar visível.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <SessionLoading />;

  return isAuthenticated ? <>{children}</> : <LoginPage />;
}

/** Cadastro não deve ser acessível por quem já está logado. */
export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <SessionLoading />;
  if (isAuthenticated) return <DashboardRedirect />;

  return <>{children}</>;
}

function DashboardRedirect() {
  window.location.replace("/");

  return <SessionLoading />;
}
