import { registerEnumType } from "type-graphql";

import { CategoryColor, TransactionType } from "../generated/prisma/enums.js";

/**
 * Expõe os enums do Prisma no schema GraphQL. Como o enum é a única porta de
 * entrada desses valores, o próprio GraphQL rejeita o que está fora do
 * conjunto antes de a requisição chegar ao service.
 */
registerEnumType(CategoryColor, {
  name: "CategoryColor",
  description:
    "Chave semântica de cor da categoria. O design system do frontend mapeia a chave para os tokens dark/base/light.",
});

registerEnumType(TransactionType, {
  name: "TransactionType",
  description:
    "Tipo da transação. A UI usa rótulos diferentes por contexto (Receita/Entrada, Despesa/Saída), mas o domínio tem um único conceito.",
});

export { CategoryColor, TransactionType };
