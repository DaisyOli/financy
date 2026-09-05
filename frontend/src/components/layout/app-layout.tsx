import type { ReactNode } from "react";

import { AppHeader } from "./app-header";

/** Moldura das telas autenticadas. */
export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-gray-100">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}

/** Título e subtítulo com a ação primária à direita. */
export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        <p className="mt-1 text-gray-600">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}
