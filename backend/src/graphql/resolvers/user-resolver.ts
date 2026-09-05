import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";

import { requireUser } from "../../auth/require-user.js";
import * as userService from "../../services/user-service.js";
import type { GraphQLContext } from "../context.js";
import { UpdateProfileInput } from "../inputs/user-inputs.js";
import { User } from "../models/user.js";

@Resolver()
export class UserResolver {
  /** Protegida: devolve apenas o usuário do token. */
  @Query(() => User)
  async me(@Ctx() context: GraphQLContext): Promise<User> {
    return userService.findAuthenticatedUser(requireUser(context));
  }

  @Mutation(() => User)
  async updateProfile(
    @Arg("data", () => UpdateProfileInput) data: UpdateProfileInput,
    @Ctx() context: GraphQLContext,
  ): Promise<User> {
    return userService.updateProfileName(requireUser(context), data.name);
  }
}
