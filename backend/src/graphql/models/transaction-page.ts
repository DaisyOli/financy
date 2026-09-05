import { Field, Int, ObjectType } from "type-graphql";

import { Transaction } from "./transaction.js";

/** Página de resultados da tabela de transações. */
@ObjectType()
export class TransactionPage {
  @Field(() => [Transaction])
  items!: Transaction[];

  /** Total de transações que atendem aos filtros, não só as desta página. */
  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  pageSize!: number;

  @Field(() => Int)
  totalPages!: number;
}
