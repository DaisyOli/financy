/**
 * Iniciais do avatar: "Conta teste" -> "CT", "Daisy Oliani" -> "DO".
 * Usa a primeira e a última palavra para nomes com mais de dois termos.
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "";
  }

  const first = parts[0]!.charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1]!.charAt(0) : "";

  return (first + last).toUpperCase();
}
