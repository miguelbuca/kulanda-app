import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { storage } from "../services";

export async function getCredentials() {
  return {
    "x-tenant-username": await storage.getValueFor("x-tenant-username"),
    "x-tenant-key": await storage.getValueFor("x-tenant-key"),
    authorization: `Bearer ${await storage.getValueFor("_kt")}`,
  };
}

export const authorized = setContext(async (_, { headers }) => {
 
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      ...(await getCredentials()),
    },
  };
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([
    authorized,
    new HttpLink({ uri: process.env.EXPO_PUBLIC_API_URL }),
  ]),
});
