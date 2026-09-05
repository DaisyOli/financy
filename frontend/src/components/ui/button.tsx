import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "../../lib/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "md" | "sm";
  icon?: ReactNode;
  fullWidth?: boolean;
}

/** Estados Default/Hover/Disabled nos dois tamanhos, como no Style Guide. */
const VARIANTS = {
  primary: cn(
    "bg-brand-base text-white",
    "hover:bg-brand-dark",
    "disabled:bg-brand-base/40 disabled:hover:bg-brand-base/40",
  ),
  secondary: cn(
    "bg-white text-gray-700 border border-gray-300",
    "hover:bg-gray-100",
    "disabled:text-gray-400 disabled:border-gray-200 disabled:hover:bg-white",
  ),
};

const SIZES = {
  md: "h-12 px-5 text-base gap-2",
  sm: "h-10 px-4 text-sm gap-1.5",
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  fullWidth,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium",
        "transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
        "focus-visible:outline-brand-base disabled:cursor-not-allowed",
        VARIANTS[variant],
        SIZES[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
