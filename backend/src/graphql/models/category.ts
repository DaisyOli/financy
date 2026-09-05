import { Field, ID, Int, ObjectType } from "type-graphql";

import { CategoryColor } from "../enums.js";

@ObjectType()
export class Category {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  /** Identificador de ícone do Lucide, nunca SVG. */
  @Field(() => String)
  icon!: string;

  @Field(() => CategoryColor)
  color!: CategoryColor;

  /** Quantas transações usam esta categoria. Alimenta o card do Figma. */
  @Field(() => Int)
  transactionCount!: number;

  @Field(() => Date)
  createdAt!: Date;
}
