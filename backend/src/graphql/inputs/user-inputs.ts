import { Field, InputType } from "type-graphql";

/** Só o nome: o e-mail é deliberadamente ausente e não pode ser editado. */
@InputType()
export class UpdateProfileInput {
  @Field(() => String)
  name!: string;
}
