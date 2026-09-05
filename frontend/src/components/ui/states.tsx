import type { ReactNode } from "react";

/** Estados que o Figma não desenha, mas a aplicação precisa (seção 32). */
export function LoadingState({ label = "Carregando..." }: { label?: string }) {
  return <p className="px-6 py-10 text-center text-gray-500">{label}</p>;
}

export function ErrorState({ message }: { message: string }) {
  return (
    <p role="alert" className="px-6 py-10 text-center text-danger">
      {message}
    </p>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="px-6 py-10 text-center text-gray-500">{children}</p>;
}
