import { categoryColorClasses } from "../../lib/category-color";
import { getCategoryIcon } from "../../lib/category-icons";
import { cn } from "../../lib/cn";

interface CategoryIconProps {
  icon: string;
  color: string;
  size?: "sm" | "md";
  className?: string;
}

/** Quadrado colorido com o ícone da categoria, usado em listas e cards. */
export function CategoryIcon({ icon, color, size = "sm", className }: CategoryIconProps) {
  const Icon = getCategoryIcon(icon);

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-lg",
        categoryColorClasses(color).icon,
        size === "sm" ? "size-10" : "size-12",
        className,
      )}
    >
      <Icon className={size === "sm" ? "size-5" : "size-6"} />
    </span>
  );
}
