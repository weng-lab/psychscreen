import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

export const SCREEN_GRAPHQL_PATH = "/api/screen-graphql";

export const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: SCREEN_GRAPHQL_PATH }),
  cache: new InMemoryCache(),
});
