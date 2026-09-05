import { ValidationError } from "../errors/app-error.js";

/** Formato de e-mail deliberadamente simples: o backend rejeita o obviamente inválido. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const MONTH_PATTERN = /^(\d{4})-(\d{2})$/;

export const MIN_PASSWORD_LENGTH = 8;

export function requireText(value: string | undefined | null, field: string): string {
  const trimmed = value?.trim() ?? "";

  if (!trimmed) {
    throw new ValidationError(`O campo ${field} é obrigatório.`);
  }

  return trimmed;
}

/** Normaliza o e-mail para que cadastro e login concordem sempre. */
export function normalizeEmail(value: string | undefined | null): string {
  const email = requireText(value, "e-mail").toLowerCase();

  if (!EMAIL_PATTERN.test(email)) {
    throw new ValidationError("Informe um e-mail válido.");
  }

  return email;
}

export function validatePassword(value: string | undefined | null): string {
  const password = value ?? "";

  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new ValidationError(
      `A senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres.`,
    );
  }

  return password;
}

/**
 * Valida uma data-only YYYY-MM-DD e devolve a MESMA string.
 *
 * O Date só aparece aqui como calendário, em UTC, para rejeitar datas
 * inexistentes como 2026-02-30 — o valor guardado continua sendo a string
 * original, sem nenhuma conversão de fuso (CLAUDE.md seção 12).
 */
export function validateTransactionDate(value: string | undefined | null): string {
  const date = requireText(value, "data");
  const match = DATE_PATTERN.exec(date);

  if (!match) {
    throw new ValidationError("A data deve estar no formato AAAA-MM-DD.");
  }

  const [, year, month, day] = match;
  const asNumbers = { year: Number(year), month: Number(month), day: Number(day) };
  const calendar = new Date(
    Date.UTC(asNumbers.year, asNumbers.month - 1, asNumbers.day),
  );

  const isRealDate =
    calendar.getUTCFullYear() === asNumbers.year &&
    calendar.getUTCMonth() === asNumbers.month - 1 &&
    calendar.getUTCDate() === asNumbers.day;

  if (!isRealDate) {
    throw new ValidationError("Informe uma data de calendário válida.");
  }

  return date;
}

/** Valida o filtro de período no formato YYYY-MM. */
export function validateMonth(value: string): string {
  const month = requireText(value, "período");
  const match = MONTH_PATTERN.exec(month);

  if (!match || Number(match[2]) < 1 || Number(match[2]) > 12) {
    throw new ValidationError("O período deve estar no formato AAAA-MM.");
  }

  return month;
}

/** O valor trafega e é guardado em centavos inteiros, nunca em ponto flutuante. */
export function validateAmountInCents(value: number): number {
  if (!Number.isInteger(value)) {
    throw new ValidationError("O valor deve ser um número inteiro em centavos.");
  }

  if (value <= 0) {
    throw new ValidationError("O valor deve ser maior que zero.");
  }

  return value;
}
