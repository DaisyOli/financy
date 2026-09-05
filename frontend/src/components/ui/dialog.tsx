import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: ReactNode;
}

/**
 * Radix cuida de foco, Esc e acessibilidade; o visual é todo do Financy,
 * não do padrão da biblioteca (CLAUDE.md seção 19).
 */
export function Dialog({ open, onOpenChange, title, description, children }: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-40 bg-gray-800/40" />
        <RadixDialog.Content
          className="fixed top-1/2 left-1/2 z-50 flex max-h-[90dvh] w-[calc(100vw-2rem)] max-w-md
                     -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded-xl
                     border border-gray-200 bg-white p-6 shadow-lg"
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <RadixDialog.Title className="text-lg font-bold text-gray-800">
                {title}
              </RadixDialog.Title>
              <RadixDialog.Description className="mt-0.5 text-sm text-gray-600">
                {description}
              </RadixDialog.Description>
            </div>

            <RadixDialog.Close
              aria-label="Fechar"
              className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="size-5" />
            </RadixDialog.Close>
          </div>

          {children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
