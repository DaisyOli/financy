import { Field, ID, InputType, Int } from "type-graphql";

import { TransactionType } from "../enums.js";

/** Um único input serve criação e edição, como o dialog do Figma. */
@InputType()
export class TransactionInput {
  @Field(() => String)
  description!: string;

  @Field(() => TransactionType)
  type!: TransactionType;

  @Field(() => Int)
  amountInCents!: number;

  /** AAAA-MM-DD. */
  @Field(() => String)
  date!: string;

  @Field(() => ID)
  categoryId!: string;
}

/** Todos os campos são opcionais: sem filtros, devolve a primeira página. */
@InputType()
export class TransactionFiltersInput {
  /** Busca por trecho da descrição. */
  @Field(() => String, { nullable: true })
  search?: string | null;

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType | null;

  @Field(() => ID, { nullable: true })
  categoryId?: string | null;

  /** Período no formato AAAA-MM. */
  @Field(() => String, { nullable: true })
  month?: string | null;

  @Field(() => Int, { nullable: true })
  page?: number | null;

  @Field(() => Int, { nullable: true })
  pageSize?: number | null;
}
