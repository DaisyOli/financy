import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { CategoryIcon } from "../../components/categories/category-icon";
import { AppLayout, PageHeader } from "../../components/layout/app-layout";
import { TransactionDialog } from "../../components/transactions/transaction-dialog";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { ConfirmDialog } from "../../components/ui/confirm-dialog";
import { IconButton } from "../../components/ui/icon-button";
import { Input } from "../../components/ui/input";
import { Pagination } from "../../components/ui/pagination";
import { Select } from "../../components/ui/select";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/states";
import { Tag } from "../../components/ui/tag";
import { TransactionType } from "../../components/ui/transaction-type";
import { CATEGORIES, type Category } from "../../graphql/categories";
import {
  DELETE_TRANSACTION,
  TRANSACTIONS,
  type Transaction,
  type TransactionPage,
} from "../../graphql/transactions";
import { formatCents } from "../../lib/currency";
import { formatTransactionDate } from "../../lib/date";
import { STALE_DATA_MESSAGE, getErrorCode, getErrorMessage } from "../../lib/error-message";
import { buildMonthOptions } from "../../lib/month-options";
import { refreshTransactionData } from "../../lib/refresh-cache";

const ALL = "all";

export function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [type, setType] = useState(ALL);
  const [categoryId, setCategoryId] = useState(ALL);
  const [month, setMonth] = useState(ALL);
  const [page, setPage] = useState(1);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Transaction | null>(null);

  // Evita disparar uma consulta a cada tecla digitada. O reset de página
  // acompanha o termo já debounced, para não voltar à página 1 a cada letra.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch((current) => {
        if (current !== search) {
          setPage(1);
        }

        return search;
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  /**
   * Trocar um filtro volta para a primeira página: continuar na página 5 de
   * um resultado que agora tem 2 páginas mostraria uma tela vazia.
   */
  function changeFilter(apply: (value: string) => void) {
    return (value: string) => {
      apply(value);
      setPage(1);
    };
  }

  const filters = useMemo(
    () => ({
      search: debouncedSearch || null,
      type: type === ALL ? null : type,
      categoryId: categoryId === ALL ? null : categoryId,
      month: month === ALL ? null : month,
      page,
    }),
    [debouncedSearch, type, categoryId, month, page],
  );

  const { data, loading, error, refetch } = useQuery<{ transactions: TransactionPage }>(
    TRANSACTIONS,
    { variables: { filters } },
  );

  const { data: categoriesData } = useQuery<{ categories: Category[] }>(CATEGORIES);

  const client = useApolloClient();
  const [deleteTransaction, { loading: deleting }] = useMutation(DELETE_TRANSACTION, {
    onCompleted: () => refreshTransactionData(client),
  });

  async function handleDelete() {
    if (!toDelete) return;

    setActionError(null);

    try {
      await deleteTransaction({ variables: { id: toDelete.id } });
      setToDelete(null);
    } catch (caught) {
      setToDelete(null);

      if (getErrorCode(caught) === "NOT_FOUND") {
        await refetch();
        setActionError(STALE_DATA_MESSAGE);
        return;
      }

      setActionError(getErrorMessage(caught, "Não foi possível excluir a transação."));
    }
  }

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(transaction: Transaction) {
    setEditing(transaction);
    setDialogOpen(true);
  }

  const result = data?.transactions;
  const firstItem = result && result.total > 0 ? (result.page - 1) * result.pageSize + 1 : 0;
  const lastItem = result ? Math.min(result.page * result.pageSize, result.total) : 0;

  return (
    <AppLayout>
      <PageHeader
        title="Transações"
        subtitle="Gerencie todas as suas transações financeiras"
        action={
          <Button icon={<Plus className="size-5" />} onClick={openCreate}>
            Nova transação
          </Button>
        }
      />

      {actionError && (
        <p
          role="alert"
          className="mb-6 rounded-lg border border-danger/30 bg-red-light px-4 py-3 text-sm text-red-dark"
        >
          {actionError}
        </p>
      )}

      <Card className="mb-6 grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">
        <Input
          label="Buscar"
          placeholder="Buscar por descrição"
          icon={<Search />}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Select
          label="Tipo"
          value={type}
          onValueChange={changeFilter(setType)}
          options={[
            { value: ALL, label: "Todos" },
            { value: "INCOME", label: "Entrada" },
            { value: "EXPENSE", label: "Saída" },
          ]}
        />
        <Select
          label="Categoria"
          value={categoryId}
          onValueChange={changeFilter(setCategoryId)}
          options={[
            { value: ALL, label: "Todas" },
            ...(categoriesData?.categories.map((category) => ({
              value: category.id,
              label: category.title,
            })) ?? []),
          ]}
        />
        <Select
          label="Período"
          value={month}
          onValueChange={changeFilter(setMonth)}
          options={[{ value: ALL, label: "Todos" }, ...buildMonthOptions()]}
        />
      </Card>

      <Card>
        {loading && <LoadingState />}
        {error && <ErrorState message="Não foi possível carregar as transações." />}

        {result && result.total === 0 && (
          <EmptyState>Nenhuma transação encontrada para os filtros escolhidos.</EmptyState>
        )}

        {result && result.total > 0 && (
          <>
            {/* Tabela rola na horizontal em telas estreitas, sem quebrar a página. */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[840px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    {["Descrição", "Data", "Categoria", "Tipo", "Valor", "Ações"].map(
                      (heading, index) => (
                        <th
                          key={heading}
                          scope="col"
                          className={`px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase ${
                            index >= 4 ? "text-right" : "text-left"
                          }`}
                        >
                          {heading}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>

                <tbody>
                  {result.items.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-200 last:border-0">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <CategoryIcon
                            icon={transaction.category.icon}
                            color={transaction.category.color}
                          />
                          <span className="font-medium text-gray-800">
                            {transaction.description}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {formatTransactionDate(transaction.date)}
                      </td>
                      <td className="px-6 py-4">
                        <Tag
                          label={transaction.category.title}
                          color={transaction.category.color}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <TransactionType type={transaction.type} />
                      </td>
                      <td className="px-6 py-4 text-right font-semibold whitespace-nowrap text-gray-800">
                        {transaction.type === "INCOME" ? "+" : "-"}{" "}
                        {formatCents(transaction.amountInCents)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <IconButton
                            icon={<Trash2 className="size-4" />}
                            tone="danger"
                            label={`Excluir ${transaction.description}`}
                            onClick={() => setToDelete(transaction)}
                          />
                          <IconButton
                            icon={<Pencil className="size-4" />}
                            label={`Editar ${transaction.description}`}
                            onClick={() => openEdit(transaction)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 px-6 py-4">
              <p className="text-sm text-gray-600">
                {firstItem} a {lastItem} <span className="text-gray-300">|</span> {result.total}{" "}
                {result.total === 1 ? "resultado" : "resultados"}
              </p>

              <Pagination
                page={result.page}
                totalPages={result.totalPages}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </Card>

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        transaction={editing}
      />

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Excluir transação"
        description="Tem certeza que deseja excluir esta transação?"
        isPending={deleting}
        onConfirm={handleDelete}
        preview={
          toDelete && (
            <>
              <CategoryIcon
                icon={toDelete.category.icon}
                color={toDelete.category.color}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-gray-800">
                  {toDelete.description}
                </p>
                <p className="text-sm text-gray-500">
                  {formatTransactionDate(toDelete.date)} · {toDelete.category.title}
                </p>
              </div>
              <span className="font-semibold whitespace-nowrap text-gray-800">
                {toDelete.type === "INCOME" ? "+" : "-"}{" "}
                {formatCents(toDelete.amountInCents)}
              </span>
            </>
          )
        }
      />
    </AppLayout>
  );
}
