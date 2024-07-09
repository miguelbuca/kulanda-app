import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { storage } from "../services";

export async function getAccessTokenPromise() {
  return await storage.getValueFor("_kt");
}

export const authorized = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = await getAccessTokenPromise();

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${token}`,
    },
  };
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([
    authorized,
    new HttpLink({ uri: "http://192.168.0.250:3000/graphql" }),
  ]),
});
