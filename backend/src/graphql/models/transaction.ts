import { Field, ID, Int, ObjectType } from "type-graphql";

import { TransactionType } from "../enums.js";
import { Category } from "./category.js";

@ObjectType()
export class Transaction {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  description!: string;

  @Field(() => TransactionType)
  type!: TransactionType;

  /** Centavos inteiros. O frontend converte para BRL só na exibição. */
  @Field(() => Int)
  amountInCents!: number;

  /**
   * Data-only AAAA-MM-DD, exposta como String de propósito: um scalar de
   * data aplicaria fuso horário e deslocaria o dia (CLAUDE.md seção 12).
   */
  @Field(() => String)
  date!: string;

  @Field(() => Category)
  category!: Category;

  @Field(() => Date)
  createdAt!: Date;
}
