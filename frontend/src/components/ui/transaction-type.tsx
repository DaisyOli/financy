import { CircleArrowDown, CircleArrowUp } from "lucide-react";

import { cn } from "../../lib/cn";

interface TransactionTypeProps {
  type: "INCOME" | "EXPENSE";
  className?: string;
}

/**
 * Apresentação do tipo na tabela: o domínio continua INCOME/EXPENSE,
 * a UI mostra Entrada/Saída (CLAUDE.md seção 11.3).
 */
export function TransactionType({ type, className }: TransactionTypeProps) {
  const isIncome = type === "INCOME";
  const Icon = isIncome ? CircleArrowUp : CircleArrowDown;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-medium",
        isIncome ? "text-success" : "text-danger",
        className,
      )}
    >
      <Icon className="size-4" aria-hidden />
      {isIncome ? "Entrada" : "Saída"}
    </span>
  );
}
