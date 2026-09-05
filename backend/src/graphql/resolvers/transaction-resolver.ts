import { Arg, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";

import { requireUser } from "../../auth/require-user.js";
import * as transactionService from "../../services/transaction-service.js";
import type { GraphQLContext } from "../context.js";
import {
  TransactionFiltersInput,
  TransactionInput,
} from "../inputs/transaction-inputs.js";
import { TransactionPage } from "../models/transaction-page.js";
import { Transaction } from "../models/transaction.js";

/** Todas as operações são protegidas e escopadas ao usuário do token. */
@Resolver()
export class TransactionResolver {
  @Query(() => TransactionPage)
  async transactions(
    @Ctx() context: GraphQLContext,
    @Arg("filters", () => TransactionFiltersInput, { nullable: true })
    filters?: TransactionFiltersInput,
  ): Promise<TransactionPage> {
    return transactionService.listTransactions(requireUser(context), filters ?? {});
  }

  @Mutation(() => Transaction)
  async createTransaction(
    @Arg("data", () => TransactionInput) data: TransactionInput,
    @Ctx() context: GraphQLContext,
  ): Promise<Transaction> {
    return transactionService.createTransaction(requireUser(context), data);
  }

  @Mutation(() => Transaction)
  async updateTransaction(
    @Arg("id", () => ID) id: string,
    @Arg("data", () => TransactionInput) data: TransactionInput,
    @Ctx() context: GraphQLContext,
  ): Promise<Transaction> {
    return transactionService.updateTransaction(requireUser(context), id, data);
  }

  @Mutation(() => Boolean)
  async deleteTransaction(
    @Arg("id", () => ID) id: string,
    @Ctx() context: GraphQLContext,
  ): Promise<boolean> {
    return transactionService.deleteTransaction(requireUser(context), id);
  }
}
