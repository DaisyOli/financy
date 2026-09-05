import { Field, ID, ObjectType } from "type-graphql";

/**
 * Projeção pública do usuário. `passwordHash` é deliberadamente omitido:
 * como o schema é code-first, um campo sem @Field não existe na API.
 *
 * Todo @Field declara o tipo explicitamente porque o tsx/esbuild não
 * implementa emitDecoratorMetadata — sem o tipo, o TypeGraphQL falha ao
 * montar o schema no boot.
 */
@ObjectType()
export class User {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  email!: string;

  @Field(() => Date)
  createdAt!: Date;
}
