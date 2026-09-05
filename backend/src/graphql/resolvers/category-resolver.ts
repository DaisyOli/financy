import { Arg, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";

import { requireUser } from "../../auth/require-user.js";
import * as categoryService from "../../services/category-service.js";
import type { GraphQLContext } from "../context.js";
import { CategoryInput } from "../inputs/category-inputs.js";
import { CategoryStats } from "../models/category-stats.js";
import { Category } from "../models/category.js";

/** Todas as operações são protegidas e escopadas ao usuário do token. */
@Resolver()
export class CategoryResolver {
  @Query(() => [Category])
  async categories(@Ctx() context: GraphQLContext): Promise<Category[]> {
    return categoryService.listCategories(requireUser(context));
  }

  @Query(() => CategoryStats)
  async categoryStats(@Ctx() context: GraphQLContext): Promise<CategoryStats> {
    return categoryService.getCategoryStats(requireUser(context));
  }

  @Mutation(() => Category)
  async createCategory(
    @Arg("data", () => CategoryInput) data: CategoryInput,
    @Ctx() context: GraphQLContext,
  ): Promise<Category> {
    return categoryService.createCategory(requireUser(context), data);
  }

  @Mutation(() => Category)
  async updateCategory(
    @Arg("id", () => ID) id: string,
    @Arg("data", () => CategoryInput) data: CategoryInput,
    @Ctx() context: GraphQLContext,
  ): Promise<Category> {
    return categoryService.updateCategory(requireUser(context), id, data);
  }

  @Mutation(() => Boolean)
  async deleteCategory(
    @Arg("id", () => ID) id: string,
    @Ctx() context: GraphQLContext,
  ): Promise<boolean> {
    return categoryService.deleteCategory(requireUser(context), id);
  }
}
