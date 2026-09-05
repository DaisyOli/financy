import { Field, InputType } from "type-graphql";

import { CategoryColor } from "../enums.js";

/**
 * Um único input serve criação e edição: os campos são exatamente os
 * mesmos, e o Figma usa um só dialog para os dois modos.
 */
@InputType()
export class CategoryInput {
  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => String)
  icon!: string;

  @Field(() => CategoryColor)
  color!: CategoryColor;
}
