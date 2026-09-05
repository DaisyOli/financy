import { Field, Int, ObjectType } from "type-graphql";

import { Category } from "./category.js";
import { Transaction } from "./transaction.js";

@ObjectType()
export class CategorySummary {
  @Field(() => Category)
  category!: Category;

  @Field(() => Int)
  transactionCount!: number;

  /** Total movimentado na categoria em centavos, sempre positivo. */
  @Field(() => Int)
  totalInCents!: number;
}

@ObjectType()
export class Dashboard {
  /** Período considerado nos totais mensais, no formato AAAA-MM. */
  @Field(() => String)
  month!: string;

  /** Saldo de todo o histórico: receitas menos despesas. */
  @Field(() => Int)
  balanceInCents!: number;

  @Field(() => Int)
  monthlyIncomeInCents!: number;

  @Field(() => Int)
  monthlyExpensesInCents!: number;

  /** As 5 transações mais recentes. */
  @Field(() => [Transaction])
  recentTransactions!: Transaction[];

  @Field(() => [CategorySummary])
  categorySummaries!: CategorySummary[];
}
