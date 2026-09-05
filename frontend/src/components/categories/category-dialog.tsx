import { useApolloClient, useMutation } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import {
  CATEGORIES,
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  type Category,
} from "../../graphql/categories";
import { CATEGORY_COLORS, categoryColorClasses } from "../../lib/category-color";
import { CATEGORY_ICON_KEYS, DEFAULT_CATEGORY_ICON, getCategoryIcon } from "../../lib/category-icons";
import { cn } from "../../lib/cn";
import { refreshTransactionData } from "../../lib/refresh-cache";
import { FormError } from "../layout/auth-layout";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Input } from "../ui/input";
import { getErrorCode, getErrorMessage } from "../../lib/error-message";

const categorySchema = z.object({
  title: z.string().trim().min(1, "Informe o título da categoria."),
  description: z.string().trim().optional(),
  icon: z.string().min(1),
  color: z.enum(CATEGORY_COLORS),
});

type CategoryForm = z.infer<typeof categorySchema>;

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Ausente cria; presente edita. Um só dialog para os dois modos. */
  category?: Category | null;
}

export function CategoryDialog({ open, onOpenChange, category }: CategoryDialogProps) {
  const isEditing = Boolean(category);

  const { register, handleSubmit, control, reset, setError, formState } =
    useForm<CategoryForm>({
      resolver: zodResolver(categorySchema),
      defaultValues: {
        title: "",
        description: "",
        icon: DEFAULT_CATEGORY_ICON,
        color: "green",
      },
    });

  // Recarrega o formulário sempre que o dialog abre, para não misturar
  // dados de uma edição anterior.
  useEffect(() => {
    if (!open) return;

    reset({
      title: category?.title ?? "",
      description: category?.description ?? "",
      icon: category?.icon ?? DEFAULT_CATEGORY_ICON,
      color: (category?.color as CategoryForm["color"]) ?? "green",
    });
  }, [open, category, reset]);

  const client = useApolloClient();
  const refetchCategories = () => client.refetchQueries({ include: [CATEGORIES] });
  const refresh = () => refreshTransactionData(client);
  const [createCategory, createState] = useMutation(CREATE_CATEGORY, { onCompleted: refresh });
  const [updateCategory, updateState] = useMutation(UPDATE_CATEGORY, { onCompleted: refresh });

  const isSaving = createState.loading || updateState.loading;

  async function onSubmit(values: CategoryForm) {
    const data = {
      title: values.title,
      description: values.description?.trim() ? values.description.trim() : null,
      icon: values.icon,
      color: values.color,
    };

    try {
      if (category) {
        await updateCategory({ variables: { id: category.id, data } });
      } else {
        await createCategory({ variables: { data } });
      }

      onOpenChange(false);
    } catch (error) {
      if (getErrorCode(error) === "NOT_FOUND") {
        // A categoria sumiu por fora: recarrega a lista e fecha o dialog,
        // que agora aponta para um id inexistente.
        await refetchCategories();
        onOpenChange(false);
        return;
      }

      setError("root", {
        message: getErrorMessage(error, "Não foi possível salvar a categoria."),
      });
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? "Editar categoria" : "Nova categoria"}
      description="Organize suas transações com categorias"
    >
      {formState.errors.root && <FormError message={formState.errors.root.message!} />}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <Input
          label="Título"
          placeholder="Ex. Alimentação"
          error={formState.errors.title?.message}
          {...register("title")}
        />

        <Input
          label="Descrição"
          placeholder="Descrição da categoria"
          helperText="Opcional"
          {...register("description")}
        />

        <Controller
          control={control}
          name="icon"
          render={({ field }) => (
            <fieldset>
              <legend className="mb-1.5 text-sm font-medium text-gray-700">Ícone</legend>
              <div className="grid grid-cols-8 gap-2">
                {CATEGORY_ICON_KEYS.map((key) => {
                  const Icon = getCategoryIcon(key);
                  const isSelected = field.value === key;

                  return (
                    <button
                      key={key}
                      type="button"
                      aria-label={key}
                      aria-pressed={isSelected}
                      onClick={() => field.onChange(key)}
                      className={cn(
                        "flex aspect-square items-center justify-center rounded-lg border transition-colors",
                        isSelected
                          ? "border-brand-base bg-brand-base/10 text-brand-base"
                          : "border-gray-200 text-gray-600 hover:bg-gray-100",
                      )}
                    >
                      <Icon className="size-5" />
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}
        />

        <Controller
          control={control}
          name="color"
          render={({ field }) => (
            <fieldset>
              <legend className="mb-1.5 text-sm font-medium text-gray-700">Cor</legend>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_COLORS.map((color) => {
                  const isSelected = field.value === color;

                  return (
                    <button
                      key={color}
                      type="button"
                      aria-label={color}
                      aria-pressed={isSelected}
                      onClick={() => field.onChange(color)}
                      className={cn(
                        // O Figma marca a seleção só com o contorno, sem ícone interno.
                        "size-9 rounded-lg transition-all",
                        categoryColorClasses(color).swatch,
                        isSelected
                          ? "ring-2 ring-gray-800 ring-offset-2"
                          : "hover:opacity-80",
                      )}
                    />
                  );
                })}
              </div>
            </fieldset>
          )}
        />

        <Button type="submit" fullWidth disabled={isSaving}>
          {isSaving ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </Dialog>
  );
}
