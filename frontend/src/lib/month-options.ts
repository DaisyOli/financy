import { formatMonth } from "./date";

/**
 * Períodos do filtro: os últimos meses a partir do atual, no fuso do
 * usuário. Rotulados por extenso ("Novembro / 2025"), mas o valor enviado
 * ao backend continua sendo AAAA-MM.
 */
export function buildMonthOptions(count = 12) {
  const now = new Date();

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    return { value, label: formatMonth(value) };
  });
}
