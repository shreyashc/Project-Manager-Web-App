import { withApollo as createWithApollo } from "next-apollo";
import { ApolloClient, InMemoryCache } from "@apollo/client";

const uri = "http://localhost:4000/graphql";
const apolloClient = new ApolloClient({
  uri,
  credentials: "include",
  cache: new InMemoryCache(),
});

export default createWithApollo(apolloClient);
