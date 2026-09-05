import {
  Book,
  Briefcase,
  Car,
  CreditCard,
  Dumbbell,
  FileText,
  Gift,
  GraduationCap,
  HeartPulse,
  House,
  PiggyBank,
  Plane,
  ShoppingCart,
  Ticket,
  Utensils,
  Wallet,
  type LucideIcon,
} from "lucide-react";

/**
 * Conjunto fechado do seletor do dialog de categoria. O backend guarda a
 * chave (ex.: "utensils"), nunca SVG (CLAUDE.md seção 11.2).
 */
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  utensils: Utensils,
  "shopping-cart": ShoppingCart,
  car: Car,
  house: House,
  briefcase: Briefcase,
  "piggy-bank": PiggyBank,
  "heart-pulse": HeartPulse,
  ticket: Ticket,
  gift: Gift,
  book: Book,
  "credit-card": CreditCard,
  "file-text": FileText,
  plane: Plane,
  dumbbell: Dumbbell,
  "graduation-cap": GraduationCap,
  wallet: Wallet,
};

export const CATEGORY_ICON_KEYS = Object.keys(CATEGORY_ICONS);

export const DEFAULT_CATEGORY_ICON = "wallet";

/** Nunca quebra a tela: uma chave desconhecida cai no ícone padrão. */
export function getCategoryIcon(key: string): LucideIcon {
  return CATEGORY_ICONS[key] ?? CATEGORY_ICONS[DEFAULT_CATEGORY_ICON]!;
}
