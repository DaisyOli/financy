import { BusinessRuleError, NotFoundError } from "../errors/app-error.js";
import { Prisma } from "../generated/prisma/client.js";
import type { CategoryColor } from "../generated/prisma/enums.js";
import { prisma } from "../lib/prisma.js";
import { requireText } from "./validation.js";

export interface CategoryData {
  title: string;
  description?: string | null;
  icon: string;
  color: CategoryColor;
}

export interface CategoryWithCount {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  color: CategoryColor;
  transactionCount: number;
  createdAt: Date;
}

export interface CategoryStatsResult {
  totalCategories: number;
  totalTransactions: number;
  mostUsedCategory: CategoryWithCount | null;
}

/** Traz a contagem de transações junto, evitando N+1 na listagem. */
const withCount = {
  _count: { select: { transactions: true } },
} satisfies Prisma.CategoryInclude;

type CategoryRow = Prisma.CategoryGetPayload<{ include: typeof withCount }>;

function toCategory(row: CategoryRow): CategoryWithCount {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    icon: row.icon,
    color: row.color,
    transactionCount: row._count.transactions,
    createdAt: row.createdAt,
  };
}

function parseInput(input: CategoryData) {
  const description = input.description?.trim();

  return {
    title: requireText(input.title, "título"),
    // String vazia vira null para o banco não guardar "" como descrição.
    description: description ? description : null,
    icon: requireText(input.icon, "ícone"),
    // A cor já chega restrita ao conjunto suportado pelo enum do GraphQL.
    color: input.color,
  };
}

/**
 * Carrega uma categoria garantindo posse. Responde "não encontrada" também
 * quando a categoria é de outro usuário: informar que ela existe já seria
 * vazar dado alheio.
 */
async function findOwnedCategory(userId: string, id: string): Promise<CategoryRow> {
  const category = await prisma.category.findFirst({
    where: { id, userId },
    include: withCount,
  });

  if (!category) {
    throw new NotFoundError("Categoria não encontrada.");
  }

  return category;
}

export async function listCategories(userId: string): Promise<CategoryWithCount[]> {
  const categories = await prisma.category.findMany({
    where: { userId },
    include: withCount,
    orderBy: { title: "asc" },
  });

  return categories.map(toCategory);
}

export async function createCategory(
  userId: string,
  input: CategoryData,
): Promise<CategoryWithCount> {
  const category = await prisma.category.create({
    // userId vem sempre do JWT, nunca do cliente.
    data: { ...parseInput(input), userId },
    include: withCount,
  });

  return toCategory(category);
}

export async function updateCategory(
  userId: string,
  id: string,
  input: CategoryData,
): Promise<CategoryWithCount> {
  await findOwnedCategory(userId, id);

  const category = await prisma.category.update({
    where: { id },
    data: parseInput(input),
    include: withCount,
  });

  return toCategory(category);
}

export async function deleteCategory(userId: string, id: string): Promise<boolean> {
  const category = await findOwnedCategory(userId, id);

  if (category._count.transactions > 0) {
    throw new BusinessRuleError(
      "Esta categoria possui transações e não pode ser excluída.",
    );
  }

  try {
    await prisma.category.delete({ where: { id } });
  } catch (error) {
    // Rede de segurança: se uma transação for criada entre a verificação
    // acima e o delete, o onDelete: Restrict do banco barra a exclusão.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      throw new BusinessRuleError(
        "Esta categoria possui transações e não pode ser excluída.",
      );
    }

    throw error;
  }

  return true;
}

export async function getCategoryStats(userId: string): Promise<CategoryStatsResult> {
  const [totalCategories, totalTransactions, ranked] = await Promise.all([
    prisma.category.count({ where: { userId } }),
    prisma.transaction.count({ where: { userId } }),
    prisma.category.findMany({
      where: { userId },
      include: withCount,
      // Título como desempate para a ordem ser estável entre chamadas.
      orderBy: [{ transactions: { _count: "desc" } }, { title: "asc" }],
      take: 1,
    }),
  ]);

  const top = ranked[0];

  return {
    totalCategories,
    totalTransactions,
    // Sem nenhuma transação não existe "mais usada".
    mostUsedCategory: top && top._count.transactions > 0 ? toCategory(top) : null,
  };
}
