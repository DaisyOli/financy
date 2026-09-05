/** Chaves semânticas de cor aceitas pelo backend (enum CategoryColor). */
export const CATEGORY_COLORS = [
  "green",
  "blue",
  "purple",
  "pink",
  "red",
  "orange",
  "yellow",
] as const;

export type CategoryColor = (typeof CATEGORY_COLORS)[number];

/**
 * Traduz a chave semântica nas classes do design system. É o único lugar
 * que conhece esse mapeamento — os componentes nunca escrevem cor crua.
 */
const COLOR_CLASSES: Record<CategoryColor, { tag: string; icon: string; swatch: string }> = {
  green: { tag: "bg-green-light text-green-dark", icon: "bg-green-light text-green-base", swatch: "bg-green-base" },
  blue: { tag: "bg-blue-light text-blue-dark", icon: "bg-blue-light text-blue-base", swatch: "bg-blue-base" },
  purple: { tag: "bg-purple-light text-purple-dark", icon: "bg-purple-light text-purple-base", swatch: "bg-purple-base" },
  pink: { tag: "bg-pink-light text-pink-dark", icon: "bg-pink-light text-pink-base", swatch: "bg-pink-base" },
  red: { tag: "bg-red-light text-red-dark", icon: "bg-red-light text-red-base", swatch: "bg-red-base" },
  orange: { tag: "bg-orange-light text-orange-dark", icon: "bg-orange-light text-orange-base", swatch: "bg-orange-base" },
  yellow: { tag: "bg-yellow-light text-yellow-dark", icon: "bg-yellow-light text-yellow-base", swatch: "bg-yellow-base" },
};

export function categoryColorClasses(color: string) {
  return COLOR_CLASSES[color as CategoryColor] ?? COLOR_CLASSES.green;
}
