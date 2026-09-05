import { Link as RouterLink, type LinkProps } from "react-router-dom";

import { cn } from "../../lib/cn";

/** Link do design system: verde, sublinhado no hover. */
export function Link({ className, ...props }: LinkProps) {
  return (
    <RouterLink
      className={cn(
        "text-brand-base font-medium hover:underline",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-base rounded-sm",
        className,
      )}
      {...props}
    />
  );
}
