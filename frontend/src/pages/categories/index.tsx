import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import { ArrowUpDown, Pencil, Plus, Tag as TagIcon, Trash2 } from "lucide-react";
import { useState } from "react";

import { CategoryDialog } from "../../components/categories/category-dialog";
import { CategoryIcon } from "../../components/categories/category-icon";
import { AppLayout, PageHeader } from "../../components/layout/app-layout";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { ConfirmDialog } from "../../components/ui/confirm-dialog";
import { IconButton } from "../../components/ui/icon-button";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/states";
import { Tag } from "../../components/ui/tag";
import {
  CATEGORIES,
  DELETE_CATEGORY,
  type Category,
  type CategoryStats,
} from "../../graphql/categories";
import { getCategoryIcon } from "../../lib/category-icons";
import { categoryColorClasses } from "../../lib/category-color";
import { cn } from "../../lib/cn";
import { refreshTransactionData } from "../../lib/refresh-cache";
import { STALE_DATA_MESSAGE, getErrorCode, getErrorMessage } from "../../lib/error-message";

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="flex items-center gap-4 p-6">
      {icon}
      <div className="min-w-0">
        <p className="truncate text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
          {label}
        </p>
      </div>
    </Card>
  );
}

export function CategoriesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Category | null>(null);

  const { data, loading, error, refetch } = useQuery<{
    categories: Category[];
    categoryStats: CategoryStats;
  }>(CATEGORIES);

  const client = useApolloClient();
  const [deleteCategory, { loading: deleting }] = useMutation(DELETE_CATEGORY, {
    onCompleted: () => refreshTransactionData(client),
  });

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(category: Category) {
    setEditing(category);
    setDialogOpen(true);
  }

  async function handleDelete() {
    if (!toDelete) return;

    setDeleteError(null);

    try {
      await deleteCategory({ variables: { id: toDelete.id } });
      setToDelete(null);
    } catch (caught) {
      setToDelete(null);

      if (getErrorCode(caught) === "NOT_FOUND") {
        await refetch();
        setDeleteError(STALE_DATA_MESSAGE);
        return;
      }

      // O backend recusa excluir categoria com transações; a mensagem dele
      // é o que o usuário vê (CLAUDE.md seção 15).
      setDeleteError(getErrorMessage(caught, "Não foi possível excluir a categoria."));
    }
  }

  const stats = data?.categoryStats;
  const mostUsed = stats?.mostUsedCategory;
  const MostUsedIcon = mostUsed ? getCategoryIcon(mostUsed.icon) : null;

  return (
    <AppLayout>
      <PageHeader
        title="Categorias"
        subtitle="Organize suas transações por categorias"
        action={
          <Button icon={<Plus className="size-5" />} onClick={openCreate}>
            Nova categoria
          </Button>
        }
      />

      {deleteError && (
        <p
          role="alert"
          className="mb-6 rounded-lg border border-danger/30 bg-red-light px-4 py-3 text-sm text-red-dark"
        >
          {deleteError}
        </p>
      )}

      <div className="mb-6 grid gap-6 md:grid-cols-3">
        <StatCard
          label="Total de categorias"
          value={String(stats?.totalCategories ?? 0)}
          icon={<TagIcon className="size-6 text-gray-700" />}
        />
        <StatCard
          label="Total de transações"
          value={String(stats?.totalTransactions ?? 0)}
          icon={<ArrowUpDown className="size-6 text-purple-base" />}
        />
        <StatCard
          label="Categoria mais utilizada"
          value={mostUsed?.title ?? "—"}
          icon={
            MostUsedIcon && mostUsed ? (
              // O card usa o ícone e a cor da própria categoria, como no Figma.
              <MostUsedIcon
                className={cn("size-6", categoryColorClasses(mostUsed.color).icon, "bg-transparent")}
              />
            ) : (
              <TagIcon className="size-6 text-gray-400" />
            )
          }
        />
      </div>

      {loading && <LoadingState />}
      {error && <ErrorState message="Não foi possível carregar as categorias." />}

      {data && data.categories.length === 0 && (
        <Card>
          <EmptyState>
            Você ainda não tem categorias. Crie a primeira para começar a organizar suas
            transações.
          </EmptyState>
        </Card>
      )}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {data?.categories.map((category) => (
          <Card key={category.id} className="flex flex-col p-6">
            <div className="mb-4 flex items-start justify-between">
              <CategoryIcon icon={category.icon} color={category.color} size="md" />

              <div className="flex gap-2">
                <IconButton
                  icon={<Trash2 className="size-4" />}
                  tone="danger"
                  label={`Excluir ${category.title}`}
                  onClick={() => setToDelete(category)}
                />
                <IconButton
                  icon={<Pencil className="size-4" />}
                  label={`Editar ${category.title}`}
                  onClick={() => openEdit(category)}
                />
              </div>
            </div>

            <h3 className="font-bold text-gray-800">{category.title}</h3>
            {category.description && (
              <p className="mt-1 text-sm text-gray-600">{category.description}</p>
            )}

            {/* mt-auto encosta a tag no rodapé para alinhar entre cards de alturas diferentes. */}
            <div className="mt-auto flex items-center justify-between gap-2 pt-6">
              <Tag label={category.title} color={category.color} />
              <span className="text-sm whitespace-nowrap text-gray-500">
                {category.transactionCount}{" "}
                {category.transactionCount === 1 ? "item" : "itens"}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <CategoryDialog open={dialogOpen} onOpenChange={setDialogOpen} category={editing} />

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Excluir categoria"
        description="Tem certeza que deseja excluir esta categoria?"
        isPending={deleting}
        onConfirm={handleDelete}
        preview={
          toDelete && (
            <>
              <CategoryIcon icon={toDelete.icon} color={toDelete.color} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-gray-800">{toDelete.title}</p>
                <p className="text-sm text-gray-500">
                  {toDelete.transactionCount}{" "}
                  {toDelete.transactionCount === 1 ? "transação" : "transações"}
                </p>
              </div>
            </>
          )
        }
      />
    </AppLayout>
  );
}
