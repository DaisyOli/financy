/**
 * Erros de domínio previsíveis. Os services lançam estas classes e o
 * formatError do Apollo (src/index.ts) as traduz em erros GraphQL com um
 * `code` estável, sem vazar detalhes internos do banco.
 */
export type AppErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "BUSINESS_RULE";

export class AppError extends Error {
  constructor(
    readonly code: AppErrorCode,
    message: string,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

/** Entrada inválida (campo ausente, formato incorreto, valor fora do domínio). */
export class ValidationError extends AppError {
  constructor(message: string) {
    super("VALIDATION_ERROR", message);
  }
}

/** Requisição sem autenticação válida. */
export class UnauthenticatedError extends AppError {
  constructor(message = "É necessário estar autenticado.") {
    super("UNAUTHENTICATED", message);
  }
}

/** Recurso existe, mas não pertence ao usuário autenticado. */
export class ForbiddenError extends AppError {
  constructor(message = "Você não tem acesso a este recurso.") {
    super("FORBIDDEN", message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super("NOT_FOUND", message);
  }
}

/** Conflito com dado existente, como e-mail já cadastrado. */
export class ConflictError extends AppError {
  constructor(message: string) {
    super("CONFLICT", message);
  }
}

/** Regra de negócio violada, como excluir categoria com transações. */
export class BusinessRuleError extends AppError {
  constructor(message: string) {
    super("BUSINESS_RULE", message);
  }
}
