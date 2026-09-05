import * as RadixSelect from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { useId, type ReactNode } from "react";

import { cn } from "../../lib/cn";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  icon?: ReactNode;
  error?: string;
  className?: string;
}

/**
 * Radix cuida do teclado e da acessibilidade; o visual segue o estado
 * "Select" do Style Guide, não o padrão da biblioteca.
 */
export function Select({
  label,
  value,
  onValueChange,
  options,
  placeholder = "Selecione",
  icon,
  error,
  className,
}: SelectProps) {
  const id = useId();

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <RadixSelect.Root value={value} onValueChange={onValueChange}>
        <RadixSelect.Trigger
          id={id}
          aria-invalid={error ? true : undefined}
          className={cn(
            "flex h-11 items-center gap-2.5 rounded-lg border bg-white px-3.5 text-base",
            "text-gray-800 transition-colors data-[placeholder]:text-gray-400",
            "focus-visible:border-brand-base focus-visible:outline-none",
            error ? "border-danger" : "border-gray-300",
          )}
        >
          {icon && (
            <span className="flex shrink-0 items-center text-gray-400 [&>svg]:size-5" aria-hidden>
              {icon}
            </span>
          )}
          <span className="min-w-0 flex-1 truncate text-left">
            <RadixSelect.Value placeholder={placeholder} />
          </span>
          <RadixSelect.Icon>
            <ChevronDown className="size-5 shrink-0 text-gray-400" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={4}
            className="z-50 max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden
                       rounded-lg border border-gray-200 bg-white shadow-lg"
          >
            <RadixSelect.Viewport className="p-1">
              {options.map((option) => (
                <RadixSelect.Item
                  key={option.value}
                  value={option.value}
                  className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-base
                             text-gray-700 outline-none select-none data-[highlighted]:bg-gray-100
                             data-[state=checked]:text-brand-base"
                >
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator>
                    <Check className="size-4" />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>

      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
}
