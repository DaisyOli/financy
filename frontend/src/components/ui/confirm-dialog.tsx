import * as RadixDialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

import { Button } from "./button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  /** Frase de confirmação; o destaque do item vai em `preview`. */
  description: string;
  /** Identificação visual do que será excluído (ícone, nome, valor). */
  preview?: ReactNode;
  confirmLabel?: string;
  isPending?: boolean;
  onConfirm: () => void;
}

/**
 * Confirmação para ações destrutivas. Exclusão não tem desfazer, então
 * mostra exatamente qual item está prestes a sumir.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  preview,
  confirmLabel = "Excluir",
  isPending,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-40 bg-gray-800/40" />
        <RadixDialog.Content
          className="fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2
                     -translate-y-1/2 rounded-xl border border-gray-200 bg-white p-6 shadow-lg"
        >
          <RadixDialog.Title className="text-lg font-bold text-gray-800">
            {title}
          </RadixDialog.Title>
          <RadixDialog.Description className="mt-1 text-sm text-gray-600">
            {description}
          </RadixDialog.Description>

          {preview && (
            <div className="mt-5 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-100 p-3">
              {preview}
            </div>
          )}

          <p className="mt-4 text-sm text-gray-500">Esta ação não pode ser desfeita.</p>

          <div className="mt-6 flex gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              fullWidth
              onClick={onConfirm}
              disabled={isPending}
              className="bg-danger hover:bg-red-dark disabled:bg-danger/40 disabled:hover:bg-danger/40"
            >
              {isPending ? "Excluindo..." : confirmLabel}
            </Button>
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
