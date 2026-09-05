import { buildSchema } from "type-graphql";

import { AuthResolver } from "./resolvers/auth-resolver.js";
import { CategoryResolver } from "./resolvers/category-resolver.js";
import { DashboardResolver } from "./resolvers/dashboard-resolver.js";
import { TransactionResolver } from "./resolvers/transaction-resolver.js";
import { UserResolver } from "./resolvers/user-resolver.js";

export function createSchema() {
  return buildSchema({
    resolvers: [
      AuthResolver,
      UserResolver,
      CategoryResolver,
      TransactionResolver,
      DashboardResolver,
    ],
    validate: false,
  });
}
