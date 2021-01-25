import { AuthenticationError } from "apollo-server-express";
import { MyContext } from "src/types";
import { MiddlewareFn } from "type-graphql";

/**
 * Graphql Middleware to check Authentication
 *
 */
export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new AuthenticationError("Not Authenticated");
  }
  return next();
};
