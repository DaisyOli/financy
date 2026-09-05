import type { ApolloClient } from "@apollo/client";

/**
 * Invalida no cache tudo que depende de transações.
 *
 * Refazer apenas as queries ativas não basta: com um filtro aplicado, a
 * lista sem filtro fica parada no cache e volta desatualizada quando o
 * filtro é limpo. O evict apaga todas as variações, então qualquer query
 * — ativa agora ou usada depois — busca dados novos.
 */
export function refreshTransactionData(client: ApolloClient): void {
  client.cache.evict({ fieldName: "transactions" });
  client.cache.evict({ fieldName: "dashboard" });
  client.cache.evict({ fieldName: "categories" });
  client.cache.evict({ fieldName: "categoryStats" });
  client.cache.gc();
}
