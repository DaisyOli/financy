import type { ReactNode } from "react";

import { Logo } from "../ui/logo";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

/** Moldura comum das telas de login e cadastro. */
export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-gray-100 px-4 py-10">
      <Logo className="mb-10 h-8" />

      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <p className="mt-1 text-gray-600">{subtitle}</p>
        </header>

        {children}
      </div>
    </main>
  );
}

/** Divisor "ou" entre a ação primária e a alternativa. */
export function AuthDivider() {
  return (
    <div className="my-6 flex items-center gap-4">
      <span className="h-px flex-1 bg-gray-200" />
      <span className="text-sm text-gray-500">ou</span>
      <span className="h-px flex-1 bg-gray-200" />
    </div>
  );
}

/** Mensagem de erro vinda do backend, exibida acima do formulário. */
export function FormError({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="mb-4 rounded-lg border border-danger/30 bg-red-light px-3 py-2 text-sm text-red-dark"
    >
      {message}
    </p>
  );
}
