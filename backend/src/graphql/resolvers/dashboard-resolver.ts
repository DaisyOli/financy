import { Arg, Ctx, Query, Resolver } from "type-graphql";

import { requireUser } from "../../auth/require-user.js";
import * as dashboardService from "../../services/dashboard-service.js";
import type { GraphQLContext } from "../context.js";
import { Dashboard } from "../models/dashboard.js";

@Resolver()
export class DashboardResolver {
  /**
   * Todos os totais são calculados no banco, com os dados do usuário do
   * token. `month` é opcional: sem ele, o backend usa o mês corrente.
   */
  @Query(() => Dashboard)
  async dashboard(
    @Ctx() context: GraphQLContext,
    @Arg("month", () => String, { nullable: true }) month?: string,
  ): Promise<Dashboard> {
    return dashboardService.getDashboard(requireUser(context), month);
  }
}
