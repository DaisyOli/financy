/**
 * Datas de transação são strings AAAA-MM-DD. A formatação parte a string
 * em pedaços de propósito: `new Date("2025-11-30")` seria interpretado
 * como UTC e poderia exibir o dia anterior (CLAUDE.md seção 12).
 */
export function formatTransactionDate(date: string): string {
  const [year, month, day] = date.split("-");

  return `${day}/${month}/${year.slice(2)}`;
}

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

/** "2025-11" -> "Novembro / 2025", como no filtro de período do Figma. */
export function formatMonth(month: string): string {
  const [year, monthNumber] = month.split("-");

  return `${MONTH_NAMES[Number(monthNumber) - 1]} / ${year}`;
}

/** Mês corrente no fuso do usuário — quem sabe em que mês ele está é o cliente. */
export function currentMonth(): string {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

/** Hoje em AAAA-MM-DD, no fuso local, para pré-preencher o campo de data. */
export function today(): string {
  const now = new Date();

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
}
