import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";

import { readToken } from "./auth-storage";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

if (!backendUrl) {
  throw new Error("Variável de ambiente VITE_BACKEND_URL não definida.");
}

/** Lê o token a cada requisição: ele muda no login e no logout. */
const authLink = new SetContextLink((prevContext) => {
  const token = readToken();

  return {
    headers: {
      ...prevContext.headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(new HttpLink({ uri: backendUrl })),
  cache: new InMemoryCache(),
});
