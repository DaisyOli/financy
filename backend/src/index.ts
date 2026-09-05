import "reflect-metadata";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";
import express from "express";
import { unwrapResolverError } from "@apollo/server/errors";

import { env } from "./env.js";
import { AppError } from "./errors/app-error.js";
import { createContext, type GraphQLContext } from "./graphql/context.js";
import { createSchema } from "./graphql/schema.js";
import { prisma } from "./lib/prisma.js";

const schema = await createSchema();

const apolloServer = new ApolloServer<GraphQLContext>({
  schema,
  // O stacktrace expõe caminhos e estrutura interna do servidor. Ele
  // continua visível no log local; o cliente recebe só a mensagem.
  includeStacktraceInErrorResponses: false,
  /**
   * Ponto único de tradução de erros: AppError vira um erro GraphQL com
   * `code` estável e mensagem própria. Qualquer outra falha continua
   * mascarada pelo Apollo, para não vazar detalhe interno do banco.
   */
  formatError: (formattedError, error) => {
    const originalError = unwrapResolverError(error);

    if (originalError instanceof AppError) {
      return {
        ...formattedError,
        message: originalError.message,
        extensions: { ...formattedError.extensions, code: originalError.code },
      };
    }

    return formattedError;
  },
});

await apolloServer.start();

const app = express();

app.use(
  "/graphql",
  cors({ origin: env.frontendUrl }),
  // O padrão do Express é 100 KB, insuficiente para o avatar em data URL
  // (o validador aceita até 400 KB). A folga evita que uma foto legítima
  // seja recusada pelo parser antes de chegar à validação.
  express.json({ limit: "1mb" }),
  expressMiddleware(apolloServer, {
    context: async ({ req }) => createContext(req),
  }),
);

const httpServer = app.listen(env.port, () => {
  console.log(`Financy backend running at http://localhost:${env.port}/graphql`);
});

/**
 * Encerramento ordenado. Sem isso, conexões keep-alive abertas pelo
 * navegador seguram o processo e o `tsx watch` acaba matando à força
 * depois de 5s ao reiniciar.
 */
const FORCED_EXIT_TIMEOUT_MS = 3000;

async function shutdown(signal: NodeJS.Signals): Promise<void> {
  console.log(`\nEncerrando (${signal})...`);

  // Rede de segurança: como este handler substitui o comportamento padrão
  // do Node de sair imediatamente, uma etapa travada deixaria o processo
  // preso para sempre. O unref() impede que o timer segure o event loop.
  const forcedExit = setTimeout(() => {
    console.warn("Encerramento demorou demais; saindo à força.");
    process.exit(1);
  }, FORCED_EXIT_TIMEOUT_MS);
  forcedExit.unref();

  try {
    httpServer.close();
    // Derruba as conexões keep-alive ociosas, que não fecham sozinhas.
    httpServer.closeAllConnections();

    await apolloServer.stop();
    await prisma.$disconnect();
  } catch (error) {
    console.error("Falha ao encerrar:", error);
    process.exit(1);
  }

  process.exit(0);
}

// `once` evita acumular listeners se o módulo for recarregado em watch mode.
for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.once(signal, (received) => {
    void shutdown(received);
  });
}
