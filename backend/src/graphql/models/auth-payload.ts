import { Field, ObjectType } from "type-graphql";

import { User } from "./user.js";

@ObjectType()
export class AuthPayload {
  @Field(() => String)
  token!: string;

  @Field(() => User)
  user!: User;
}
