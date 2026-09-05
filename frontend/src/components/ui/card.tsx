import type { ReactNode } from "react";

import { cn } from "../../lib/cn";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("rounded-xl border border-gray-200 bg-white", className)}
    >
      {children}
    </div>
  );
}

/** Cabeçalho de seção: rótulo em caixa alta e um link de atalho à direita. */
export function CardSectionHeader({
  label,
  action,
}: {
  label: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
      <h2 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
        {label}
      </h2>
      {action}
    </div>
  );
}
