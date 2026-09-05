/**
 * Reduz um texto à forma usada na busca: minúsculo e sem acentos.
 *
 * O LIKE do SQLite só ignora maiúsculas em caracteres ASCII, então
 * "salario" nunca encontraria "Salário". Guardamos uma versão normalizada
 * da descrição junto da original e é nela que a busca ocorre.
 *
 * NFD separa a letra do acento; o intervalo ̀-ͯ remove as marcas.
 */
export function normalizeForSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}
