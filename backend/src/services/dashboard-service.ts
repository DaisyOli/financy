import { prisma } from "../lib/prisma.js";
import { validateMonth } from "./validation.js";

const RECENT_TRANSACTIONS_LIMIT = 5;

/**
 * Mês corrente em UTC, usado apenas quando o cliente não informa o período.
 * O frontend deve enviar o mês calculado no fuso do usuário, que é quem
 * sabe de fato em qual mês ele está.
 */
function currentMonth(): string {
  const now = new Date();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");

  return `${now.getUTCFullYear()}-${month}`;
}

/** Soma por tipo em uma única query, evitando dois roundtrips. */
async function sumByType(where: { userId: string; date?: { startsWith: string } }) {
  const rows = await prisma.transaction.groupBy({
    by: ["type"],
    where,
    _sum: { amountInCents: true },
  });

  const totals = { INCOME: 0, EXPENSE: 0 };

  for (const row of rows) {
    totals[row.type] = row._sum.amountInCents ?? 0;
  }

  return totals;
}

export async function getDashboard(userId: string, requestedMonth?: string | null) {
  const month = requestedMonth ? validateMonth(requestedMonth) : currentMonth();

  const [allTime, monthly, recentRows, categories, grouped] = await Promise.all([
    // Saldo total considera todo o histórico, não apenas o mês.
    sumByType({ userId }),
    sumByType({ userId, date: { startsWith: month } }),
    prisma.transaction.findMany({
      where: { userId },
      include: { category: { include: { _count: { select: { transactions: true } } } } },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      take: RECENT_TRANSACTIONS_LIMIT,
    }),
    prisma.category.findMany({
      where: { userId },
      include: { _count: { select: { transactions: true } } },
      orderBy: { title: "asc" },
    }),
    prisma.transaction.groupBy({
      by: ["categoryId", "type"],
      where: { userId },
      _sum: { amountInCents: true },
    }),
  ]);

  const totalsByCategory = new Map<string, { income: number; expenses: number }>();

  for (const row of grouped) {
    const totals = totalsByCategory.get(row.categoryId) ?? { income: 0, expenses: 0 };
    const amount = row._sum.amountInCents ?? 0;

    if (row.type === "INCOME") {
      totals.income += amount;
    } else {
      totals.expenses += amount;
    }

    totalsByCategory.set(row.categoryId, totals);
  }

  const toCategory = (row: (typeof categories)[number]) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    icon: row.icon,
    color: row.color,
    transactionCount: row._count.transactions,
    createdAt: row.createdAt,
  });

  return {
    month,
    balanceInCents: allTime.INCOME - allTime.EXPENSE,
    monthlyIncomeInCents: monthly.INCOME,
    monthlyExpensesInCents: monthly.EXPENSE,
    recentTransactions: recentRows.map((row) => ({
      id: row.id,
      description: row.description,
      type: row.type,
      amountInCents: row.amountInCents,
      date: row.date,
      createdAt: row.createdAt,
      category: {
        id: row.category.id,
        title: row.category.title,
        description: row.category.description,
        icon: row.category.icon,
        color: row.category.color,
        transactionCount: row.category._count.transactions,
        createdAt: row.category.createdAt,
      },
    })),
    // Ordem por título, igual à listagem de categorias: estável e sem
    // inventar critério de ranking (CLAUDE.md seção 16.4).
    categorySummaries: categories.map((category) => {
      const totals = totalsByCategory.get(category.id) ?? { income: 0, expenses: 0 };

      return {
        category: toCategory(category),
        transactionCount: category._count.transactions,
        // Total movimentado na categoria, sempre positivo: o Figma mostra
        // o resumo sem sinal e coloca o +/- na linha da transação.
        totalInCents: totals.income + totals.expenses,
      };
    }),
  };
}
