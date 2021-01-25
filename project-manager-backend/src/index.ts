import { ApolloServer } from "apollo-server-express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import app from "./app";
import { env } from "./env";
import { ProjectResolver, TaskResolver, UserResolver } from "./resolvers";

const main = async () => {
  /**
   * initialize apollo server
   */
  const apolloServer = new ApolloServer({
    debug: false,
    schema: await buildSchema({
      resolvers: [UserResolver, ProjectResolver, TaskResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
    }),
  });
  /**
   * attach apolloServer
   */
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  /**
   * create httpServer
   */
  const port = env.app.port || 4000;
  app.set("port", port);
  app.listen(4000, () =>
    console.log("project manager server running on port " + port)
  );
};

main().catch((err) => console.log(err));
