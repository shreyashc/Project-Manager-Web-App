import { ApolloServer } from "apollo-server-express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import app from "./app";
import { env } from "./env";
import { ProjectResolver, TaskResolver, UserResolver } from "./resolvers";
import http from "http";
import { createTaskLoader } from "./lib/dataloader/createTaskLoader";

const main = async () => {
  /**
   * initialize apollo server
   */
  const apolloServer = new ApolloServer({
    debug: true,
    schema: await buildSchema({
      resolvers: [UserResolver, ProjectResolver, TaskResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      taskLoader: createTaskLoader(),
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

  const server = http.createServer(app);

  server.listen(port, () => {
    console.log("Server started on Port", port);
  });
};

main().catch((err) => console.log(err));
