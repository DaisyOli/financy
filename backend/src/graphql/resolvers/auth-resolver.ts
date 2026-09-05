import { Arg, Mutation, Resolver } from "type-graphql";

import * as authService from "../../services/auth-service.js";
import { LoginInput, RegisterInput } from "../inputs/auth-inputs.js";
import { AuthPayload } from "../models/auth-payload.js";
import { User } from "../models/user.js";

/**
 * Operações públicas de entrada. @Arg e @Field declaram o tipo
 * explicitamente porque o tsx/esbuild não implementa emitDecoratorMetadata.
 */
@Resolver()
export class AuthResolver {
  /**
   * Não devolve token: o fluxo do Figma manda o usuário para a tela de
   * login após o cadastro.
   */
  @Mutation(() => User)
  async register(@Arg("data", () => RegisterInput) data: RegisterInput): Promise<User> {
    return authService.register(data);
  }

  @Mutation(() => AuthPayload)
  async login(@Arg("data", () => LoginInput) data: LoginInput): Promise<AuthPayload> {
    return authService.login(data);
  }
}
