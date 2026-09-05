import { useApolloClient, useLazyQuery } from "@apollo/client/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { ME, type AuthUser } from "../graphql/auth";
import { clearToken, readToken, saveToken } from "../lib/auth-storage";

interface AuthContextValue {
  user: AuthUser | null;
  /** True até a sessão guardada ser resolvida, evitando piscar a tela de login. */
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (token: string, user: AuthUser, remember: boolean) => void;
  signOut: () => void;
  /** Reflete no header e no avatar uma alteração feita no perfil. */
  refreshUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const client = useApolloClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadMe] = useLazyQuery<{ me: AuthUser }>(ME, { fetchPolicy: "network-only" });

  // Ao abrir o app, revalida o token guardado contra o backend: um token
  // expirado ou revogado não deve manter a aparência de sessão ativa.
  useEffect(() => {
    if (!readToken()) {
      setIsLoading(false);
      return;
    }

    let active = true;

    loadMe()
      .then((result) => {
        if (!active) return;

        if (result.data?.me) {
          setUser(result.data.me);
        } else {
          clearToken();
        }
      })
      .catch(() => {
        if (active) clearToken();
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [loadMe]);

  const signIn = useCallback(
    (token: string, nextUser: AuthUser, remember: boolean) => {
      saveToken(token, remember);
      setUser(nextUser);
    },
    [],
  );

  const signOut = useCallback(() => {
    clearToken();
    setUser(null);
    // Descarta os dados do usuário anterior para não vazarem numa próxima sessão.
    void client.clearStore();
  }, [client]);

  const refreshUser = useCallback((nextUser: AuthUser) => {
    setUser(nextUser);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoading, isAuthenticated: user !== null, signIn, signOut, refreshUser }),
    [user, isLoading, signIn, signOut, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth precisa estar dentro de AuthProvider.");
  }

  return context;
}
