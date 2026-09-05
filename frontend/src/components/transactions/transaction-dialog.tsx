import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleArrowDown, CircleArrowUp } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { CATEGORIES, type Category } from "../../graphql/categories";
import {
  CREATE_TRANSACTION,
  UPDATE_TRANSACTION,
  type Transaction,
} from "../../graphql/transactions";
import { cn } from "../../lib/cn";
import {
  formatCentsForInput,
  parseCurrencyToCents,
} from "../../lib/currency";
import { today } from "../../lib/date";
import { getErrorCode, getErrorMessage } from "../../lib/error-message";
import { refreshTransactionData } from "../../lib/refresh-cache";
import { FormError } from "../layout/auth-layout";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Input } from "../ui/input";
import { Select } from "../ui/select";

const transactionSchema = z.object({
  type: z.enum(["EXPENSE", "INCOME"]),
  description: z.string().trim().min(1, "Informe a descrição."),
  date: z.string().min(1, "Informe a data."),
  amountInCents: z.number().int().positive("O valor deve ser maior que zero."),
  categoryId: z.string().min(1, "Escolha uma categoria."),
});

type TransactionForm = z.infer<typeof transactionSchema>;

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Ausente cria; presente edita. Um só dialog para os dois modos. */
  transaction?: Transaction | null;
}

/** Despesa e Receita lado a lado; o selecionado assume a cor do tipo. */
function TypeOption({
  type,
  isSelected,
  onSelect,
}: {
  type: "EXPENSE" | "INCOME";
  isSelected: boolean;
  onSelect: () => void;
}) {
  const isExpense = type === "EXPENSE";
  const Icon = isExpense ? CircleArrowDown : CircleArrowUp;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={cn(
        "flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-colors",
        isSelected
          ? isExpense
            ? "border-danger text-danger"
            : "border-success text-success"
          : "border-gray-300 text-gray-500 hover:bg-gray-100",
      )}
    >
      <Icon className="size-4" />
      {/* Rótulos do dialog: Despesa/Receita (na tabela vira Saída/Entrada). */}
      {isExpense ? "Despesa" : "Receita"}
    </button>
  );
}

export function TransactionDialog({
  open,
  onOpenChange,
  transaction,
}: TransactionDialogProps) {
  const isEditing = Boolean(transaction);
  const { data: categoriesData } = useQuery<{ categories: Category[] }>(CATEGORIES);

  const { register, handleSubmit, control, reset, setError, formState } =
    useForm<TransactionForm>({
      resolver: zodResolver(transactionSchema),
      defaultValues: {
        type: "EXPENSE",
        description: "",
        date: today(),
        amountInCents: 0,
        categoryId: "",
      },
    });

  useEffect(() => {
    if (!open) return;

    reset({
      type: transaction?.type ?? "EXPENSE",
      description: transaction?.description ?? "",
      date: transaction?.date ?? today(),
      amountInCents: transaction?.amountInCents ?? 0,
      categoryId: transaction?.category.id ?? "",
    });
  }, [open, transaction, reset]);

  // Invalida todas as variações em cache, não só as visíveis agora.
  const client = useApolloClient();
  const refresh = () => refreshTransactionData(client);

  const [createTransaction, createState] = useMutation(CREATE_TRANSACTION, {
    onCompleted: refresh,
  });
  const [updateTransaction, updateState] = useMutation(UPDATE_TRANSACTION, {
    onCompleted: refresh,
  });
  const isSaving = createState.loading || updateState.loading;

  async function onSubmit(values: TransactionForm) {
    try {
      if (transaction) {
        await updateTransaction({ variables: { id: transaction.id, data: values } });
      } else {
        await createTransaction({ variables: { data: values } });
      }

      onOpenChange(false);
    } catch (error) {
      if (getErrorCode(error) === "NOT_FOUND") {
        onOpenChange(false);
        return;
      }

      setError("root", {
        message: getErrorMessage(error, "Não foi possível salvar a transação."),
      });
    }
  }

  const categoryOptions =
    categoriesData?.categories.map((category) => ({
      value: category.id,
      label: category.title,
    })) ?? [];

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? "Editar transação" : "Nova transação"}
      description="Registre sua despesa ou receita"
    >
      {formState.errors.root && <FormError message={formState.errors.root.message!} />}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <div className="flex gap-3">
              <TypeOption
                type="EXPENSE"
                isSelected={field.value === "EXPENSE"}
                onSelect={() => field.onChange("EXPENSE")}
              />
              <TypeOption
                type="INCOME"
                isSelected={field.value === "INCOME"}
                onSelect={() => field.onChange("INCOME")}
              />
            </div>
          )}
        />

        <Input
          label="Descrição"
          placeholder="Ex. Almoço no restaurante"
          error={formState.errors.description?.message}
          {...register("description")}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Data"
            type="date"
            error={formState.errors.date?.message}
            {...register("date")}
          />

          <Controller
            control={control}
            name="amountInCents"
            render={({ field }) => (
              <Input
                label="Valor"
                inputMode="numeric"
                placeholder="R$ 0,00"
                // Exibe em BRL, guarda em centavos inteiros: o que o usuário
                // digita é lido como dígitos, sem ponto flutuante.
                value={field.value ? `R$ ${formatCentsForInput(field.value)}` : ""}
                onChange={(event) => field.onChange(parseCurrencyToCents(event.target.value))}
                error={formState.errors.amountInCents?.message}
              />
            )}
          />
        </div>

        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <Select
              label="Categoria"
              value={field.value}
              onValueChange={field.onChange}
              options={categoryOptions}
              error={formState.errors.categoryId?.message}
            />
          )}
        />

        <Button type="submit" fullWidth disabled={isSaving}>
          {isSaving ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </Dialog>
  );
}
