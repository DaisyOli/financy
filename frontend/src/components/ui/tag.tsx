import { categoryColorClasses } from "../../lib/category-color";
import { cn } from "../../lib/cn";

interface TagProps {
  label: string;
  /** Chave semântica da categoria; sem ela a tag fica neutra. */
  color?: string;
  className?: string;
}

export function Tag({ label, color, className }: TagProps) {
  const classes = color
    ? categoryColorClasses(color).tag
    : "bg-gray-200 text-gray-700";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
        classes,
        className,
      )}
    >
      {label}
    </span>
  );
}
