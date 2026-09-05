import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "../../lib/cn";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  /** `danger` usa o vermelho das ações destrutivas do Figma. */
  tone?: "neutral" | "danger";
  label: string;
}

const TONES = {
  neutral: "text-gray-600 border-gray-200 hover:bg-gray-100 disabled:text-gray-300",
  danger: "text-danger border-gray-200 hover:bg-red-light disabled:text-danger/40",
};

export function IconButton({
  icon,
  tone = "neutral",
  label,
  className,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-lg border bg-white",
        "transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
        "focus-visible:outline-brand-base disabled:cursor-not-allowed disabled:hover:bg-white",
        TONES[tone],
        className,
      )}
      {...props}
    >
      {icon}
    </button>
  );
}
