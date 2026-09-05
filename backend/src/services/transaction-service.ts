import { NotFoundError } from "../errors/app-error.js";
import type { Prisma } from "../generated/prisma/client.js";
import type { TransactionType } from "../generated/prisma/enums.js";
import { prisma } from "../lib/prisma.js";
import {
  requireText,
  validateAmountInCents,
  validateMonth,
  validateTransactionDate,
} from "./validation.js";

export const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

export interface TransactionData {
  description: string;
  type: TransactionType;
  amountInCents: number;
  date: string;
  categoryId: string;
}

export interface TransactionFilters {
  search?: string | null;
  type?: TransactionType | null;
  categoryId?: string | null;
  month?: string | null;
  page?: number | null;
  pageSize?: number | null;
}

/** A categoria acompanha a transação para a tag da tabela do Figma. */
const withCategory = {
  category: { include: { _count: { select: { transactions: true } } } },
} satisfies Prisma.TransactionInclude;

type TransactionRow = Prisma.TransactionGetPayload<{ include: typeof withCategory }>;

function toTransaction(row: TransactionRow) {
  return {
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
  };
}

/**
 * Garante que a categoria escolhida é do próprio usuário. Sem isso, alguém
 * poderia lançar transações dentro da categoria de outra pessoa apenas
 * enviando o id (CLAUDE.md seção 14).
 */
async function assertCategoryIsOwned(userId: string, categoryId: string): Promise<void> {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
    select: { id: true },
  });

  if (!category) {
    throw new NotFoundError("Categoria não encontrada.");
  }
}

async function findOwnedTransaction(userId: string, id: string): Promise<{ id: string }> {
  const transaction = await prisma.transaction.findFirst({
    where: { id, userId },
    select: { id: true },
  });

  if (!transaction) {
    throw new NotFoundError("Transação não encontrada.");
  }

  return transaction;
}

function parseInput(input: TransactionData) {
  return {
    description: requireText(input.description, "descrição"),
    type: input.type,
    amountInCents: validateAmountInCents(input.amountInCents),
    date: validateTransactionDate(input.date),
    categoryId: requireText(input.categoryId, "categoria"),
  };
}

/** Monta o WHERE do Prisma sempre ancorado no usuário autenticado. */
function buildWhere(userId: string, filters: TransactionFilters): Prisma.TransactionWhereInput {
  const where: Prisma.TransactionWhereInput = { userId };

  const search = filters.search?.trim();
  if (search) {
    where.description = { contains: search };
  }

  if (filters.type) {
    where.type = filters.type;
  }

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters.month) {
    // A data é uma string ISO, então o prefixo AAAA-MM já isola o mês
    // sem nenhuma aritmética de fuso horário.
    where.date = { startsWith: validateMonth(filters.month) };
  }

  return where;
}

function resolvePagination(filters: TransactionFilters) {
  const requestedSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;
  const pageSize = Math.min(Math.max(Math.trunc(requestedSize), 1), MAX_PAGE_SIZE);
  const page = Math.max(Math.trunc(filters.page ?? 1), 1);

  return { page, pageSize };
}

export async function listTransactions(userId: string, filters: TransactionFilters = {}) {
  const where = buildWhere(userId, filters);
  const { page, pageSize } = resolvePagination(filters);

  const [total, rows] = await Promise.all([
    prisma.transaction.count({ where }),
    prisma.transaction.findMany({
      where,
      include: withCategory,
      // Mais recentes primeiro; createdAt desempata dentro do mesmo dia.
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return {
    items: rows.map(toTransaction),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function createTransaction(userId: string, input: TransactionData) {
  const data = parseInput(input);

  await assertCategoryIsOwned(userId, data.categoryId);

  const transaction = await prisma.transaction.create({
    // userId vem do JWT, nunca do cliente.
    data: { ...data, userId },
    include: withCategory,
  });

  return toTransaction(transaction);
}

export async function updateTransaction(userId: string, id: string, input: TransactionData) {
  const data = parseInput(input);

  await findOwnedTransaction(userId, id);
  await assertCategoryIsOwned(userId, data.categoryId);

  const transaction = await prisma.transaction.update({
    where: { id },
    data,
    include: withCategory,
  });

  return toTransaction(transaction);
}

export async function deleteTransaction(userId: string, id: string): Promise<boolean> {
  await findOwnedTransaction(userId, id);

  await prisma.transaction.delete({ where: { id } });

  return true;
}
