const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** Converte centavos inteiros em BRL só para exibição. */
export function formatCents(amountInCents: number): string {
  return BRL.format(amountInCents / 100);
}

/**
 * Lê o que o usuário digitou no campo de valor e devolve centavos
 * inteiros. Trabalha sobre os dígitos, evitando ponto flutuante.
 */
export function parseCurrencyToCents(value: string): number {
  const digits = value.replace(/\D/g, "");

  return digits ? Number.parseInt(digits, 10) : 0;
}

/** Formata centavos como o usuário digita: 8950 -> "89,50". */
export function formatCentsForInput(amountInCents: number): string {
  return (amountInCents / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
