import { getInitials } from "../../lib/initials";
import { cn } from "../../lib/cn";

interface AvatarProps {
  name: string;
  size?: "sm" | "lg";
  className?: string;
}

/** Iniciais do usuário; o Figma não prevê upload de imagem. */
export function Avatar({ name, size = "sm", className }: AvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-700",
        size === "sm" ? "size-10 text-sm" : "size-20 text-2xl",
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}
