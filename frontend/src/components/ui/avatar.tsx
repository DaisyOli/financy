import { getInitials } from "../../lib/initials";
import { cn } from "../../lib/cn";

interface AvatarProps {
  name: string;
  /** Foto do perfil; sem ela, mostra as iniciais do nome. */
  imageUrl?: string | null;
  size?: "sm" | "lg";
  className?: string;
}

export function Avatar({ name, imageUrl, size = "sm", className }: AvatarProps) {
  const dimension = size === "sm" ? "size-10 text-sm" : "size-20 text-2xl";

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={`Foto de ${name}`}
        className={cn("shrink-0 rounded-full object-cover", dimension, className)}
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-700",
        dimension,
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}
