import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "../../lib/cn";

interface PaginationButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isActive?: boolean;
}

/** Estados Default/Hover/Active/Disabled do Style Guide. */
export function PaginationButton({
  children,
  isActive,
  className,
  type = "button",
  ...props
}: PaginationButtonProps) {
  return (
    <button
      type={type}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-lg border text-sm font-medium",
        "transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
        "focus-visible:outline-brand-base disabled:cursor-not-allowed",
        isActive
          ? "bg-brand-base border-brand-base text-white"
          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-white",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
