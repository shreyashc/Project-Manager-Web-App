import { ApolloClient, InMemoryCache } from "@apollo/client";
import { NextPageContext } from "next";
import { createWithApollo } from "./createWithApollo";
const uri = "http://localhost:4000/graphql";

const createClient = (ctx: NextPageContext) =>
  new ApolloClient({
    uri,
    credentials: "include",
    headers: {
      cookie:
        (typeof window === "undefined"
          ? ctx?.req?.headers.cookie
          : undefined) || "",
    },
    cache: new InMemoryCache(),
  });

export const withApollo = createWithApollo(createClient);
