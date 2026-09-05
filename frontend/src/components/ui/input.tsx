import { Eye, EyeOff } from "lucide-react";
import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

import { cn } from "../../lib/cn";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label?: string;
  /** Ícone à esquerda; acompanha a cor do estado (verde no foco, vermelho no erro). */
  icon?: ReactNode;
  helperText?: string;
  error?: string;
  /** Liga o botão de ver/ocultar senha, como no Figma. */
  revealable?: boolean;
}

/**
 * Cobre os estados do Style Guide: Empty, Active, Filled, Error e
 * Disabled. Label e borda mudam de cor junto com o estado.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, icon, helperText, error, revealable, className, type = "text", disabled, ...props },
  ref,
) {
  const id = useId();
  const [isFocused, setIsFocused] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const hasError = Boolean(error);
  const inputType = revealable && isRevealed ? "text" : type;
  const describedBy = error || helperText ? `${id}-description` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "text-sm font-medium transition-colors",
            hasError ? "text-danger" : isFocused ? "text-brand-base" : "text-gray-700",
            disabled && "text-gray-400",
          )}
        >
          {label}
        </label>
      )}

      <div
        className={cn(
          "flex h-11 items-center gap-2.5 rounded-lg border bg-white px-3.5 transition-colors",
          hasError
            ? "border-danger"
            : isFocused
              ? "border-brand-base"
              : "border-gray-300",
          disabled && "border-gray-200 bg-gray-100",
          className,
        )}
      >
        {icon && (
          <span
            className={cn(
              "flex shrink-0 items-center [&>svg]:size-5",
              hasError ? "text-danger" : isFocused ? "text-brand-base" : "text-gray-400",
            )}
            aria-hidden
          >
            {icon}
          </span>
        )}

        <input
          ref={ref}
          id={id}
          type={inputType}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          onFocus={(event) => {
            setIsFocused(true);
            props.onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            props.onBlur?.(event);
          }}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-base text-gray-800 outline-none",
            "placeholder:text-gray-400 disabled:cursor-not-allowed disabled:text-gray-400",
          )}
          {...props}
        />

        {revealable && (
          <button
            type="button"
            onClick={() => setIsRevealed((value) => !value)}
            aria-label={isRevealed ? "Ocultar senha" : "Mostrar senha"}
            className="shrink-0 text-gray-400 transition-colors hover:text-gray-600"
          >
            {isRevealed ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
          </button>
        )}
      </div>

      {(error || helperText) && (
        <span
          id={describedBy}
          className={cn("text-xs", hasError ? "text-danger" : "text-gray-500")}
        >
          {error ?? helperText}
        </span>
      )}
    </div>
  );
});
