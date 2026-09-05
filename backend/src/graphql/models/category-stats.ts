import { Field, Int, ObjectType } from "type-graphql";

import { Category } from "./category.js";

/** Cards de resumo do topo da tela de categorias. */
@ObjectType()
export class CategoryStats {
  @Field(() => Int)
  totalCategories!: number;

  @Field(() => Int)
  totalTransactions!: number;

  /** Categoria com mais transações. Nulo quando ainda não há transações. */
  @Field(() => Category, { nullable: true })
  mostUsedCategory?: Category | null;
}
