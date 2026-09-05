import { useQuery } from "@apollo/client/react";
import { CircleArrowDown, CircleArrowUp, ChevronRight, Plus, Wallet } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { TransactionDialog } from "../../components/transactions/transaction-dialog";

import { CategoryIcon } from "../../components/categories/category-icon";
import { AppLayout } from "../../components/layout/app-layout";
import { Card, CardSectionHeader } from "../../components/ui/card";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/states";
import { Tag } from "../../components/ui/tag";
import { DASHBOARD, type DashboardData } from "../../graphql/dashboard";
import { cn } from "../../lib/cn";
import { formatCents } from "../../lib/currency";
import { currentMonth, formatTransactionDate } from "../../lib/date";

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="p-6">
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <h2 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
          {label}
        </h2>
      </div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </Card>
  );
}

function SectionLink({ label, to }: { label: string; to: string }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className="flex items-center gap-1 text-sm font-medium text-brand-base hover:underline"
    >
      {label}
      <ChevronRight className="size-4" />
    </button>
  );
}

export function DashboardPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  // O mês vai calculado no fuso do usuário: o servidor não sabe onde ele está.
  const { data, loading, error } = useQuery<{ dashboard: DashboardData }>(DASHBOARD, {
    variables: { month: currentMonth() },
  });

  const dashboard = data?.dashboard;

  return (
    <AppLayout>
      <div className="mb-6 grid gap-6 md:grid-cols-3">
        <SummaryCard
          label="Saldo total"
          value={formatCents(dashboard?.balanceInCents ?? 0)}
          icon={<Wallet className="size-5 text-purple-base" />}
        />
        <SummaryCard
          label="Receitas do mês"
          value={formatCents(dashboard?.monthlyIncomeInCents ?? 0)}
          icon={<CircleArrowUp className="size-5 text-success" />}
        />
        <SummaryCard
          label="Despesas do mês"
          value={formatCents(dashboard?.monthlyExpensesInCents ?? 0)}
          icon={<CircleArrowDown className="size-5 text-danger" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardSectionHeader
            label="Transações recentes"
            action={<SectionLink label="Ver todas" to="/transactions" />}
          />

          {loading && <LoadingState />}
          {error && <ErrorState message="Não foi possível carregar as transações." />}

          {dashboard && dashboard.recentTransactions.length === 0 && (
            <EmptyState>Nenhuma transação por aqui ainda.</EmptyState>
          )}

          {dashboard?.recentTransactions.map((transaction) => {
            const isIncome = transaction.type === "INCOME";

            return (
              <div
                key={transaction.id}
                className="flex items-center gap-4 border-b border-gray-200 px-6 py-4"
              >
                <CategoryIcon
                  icon={transaction.category.icon}
                  color={transaction.category.color}
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-800">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatTransactionDate(transaction.date)}
                  </p>
                </div>

                <Tag label={transaction.category.title} color={transaction.category.color} />

                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800 whitespace-nowrap">
                    {isIncome ? "+" : "-"} {formatCents(transaction.amountInCents)}
                  </span>
                  {isIncome ? (
                    <CircleArrowUp className="size-4 text-success" />
                  ) : (
                    <CircleArrowDown className="size-4 text-danger" />
                  )}
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="flex w-full items-center justify-center gap-2 py-4 text-sm font-medium text-brand-base hover:underline"
          >
            <Plus className="size-4" />
            Nova transação
          </button>
        </Card>

        <Card className="self-start">
          <CardSectionHeader
            label="Categorias"
            action={<SectionLink label="Gerenciar" to="/categories" />}
          />

          {loading && <LoadingState />}

          {dashboard && dashboard.categorySummaries.length === 0 && (
            <EmptyState>Nenhuma categoria cadastrada.</EmptyState>
          )}

          <div
            className={cn(
              "flex flex-col gap-4 px-6",
              (dashboard?.categorySummaries.length ?? 0) > 0 && "py-5",
            )}
          >
            {dashboard?.categorySummaries.map((summary) => (
              <div key={summary.category.id} className="flex items-center gap-3">
                <Tag label={summary.category.title} color={summary.category.color} />
                <span className="ml-auto text-sm whitespace-nowrap text-gray-500">
                  {summary.transactionCount}{" "}
                  {summary.transactionCount === 1 ? "item" : "itens"}
                </span>
                <span className="font-semibold whitespace-nowrap text-gray-800">
                  {formatCents(summary.totalInCents)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <TransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </AppLayout>
  );
}
