import { ApolloServer } from "apollo-server-express";
import connectPgSimple from "connect-pg-simple";
import cors from "cors";
import express from "express";
import session, { SessionOptions } from "express-session";
import path from "path";
import pg from "pg";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { Project, Task, User } from "./entities";
import { env } from "./env";
import { createTaskLoader } from "./lib/dataloader/createTaskLoader";
import { ProjectResolver, TaskResolver, UserResolver } from "./resolvers";

const pgSession = connectPgSimple(session);

const main = async () => {
  const app = express();

  const allowedOrigins = env.app.origin.split(",");

  app.use(
    cors({
      origin: function (origin, callback) {
        console.log("Request Origin: ", origin);
        if (!origin) return callback(null, true);
        console.log(allowedOrigins.indexOf(origin) === -1);
        if (allowedOrigins.indexOf(origin) === -1) {
          var err = new Error("Origin not allowed");
          return callback(err, false);
        }
        return callback(null, true);
      },
      credentials: true,
      methods: ["POST", "PATCH", "GET", "OPTIONS", "HEAD", "DELETE"],
    })
  );

  //connect to pg db
  const con = await createConnection({
    type: "postgres",
    host: env.db.host,
    port: env.db.port,
    database: env.db.database,
    username: env.db.username,
    password: env.db.password,
    logging: env.db.logging,
    synchronize: env.db.synchronize,
    entities: [User, Project, Task],
    ssl: {
      rejectUnauthorized: false,
    },
    migrations: [path.join(__dirname, "./migrations/*")],
  });

  await con.runMigrations();

  //pool of sessions//
  const sessionPool = pg.Pool;
  const sessionDBaccess = new sessionPool({
    host: env.db.host,
    port: env.db.port,
    database: env.db.database,
    user: env.db.username,
    password: env.db.password,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  //cookie config
  const sessionConfig: SessionOptions = {
    name: env.app.cookieName,
    store: new pgSession({
      pool: sessionDBaccess,
      tableName: "session",
    }),
    resave: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 5 * 12 * 30 * 24 * 60 * 60 * 1000,
    },
    saveUninitialized: false,
    proxy: true,
    secret: env.app.cookieSecret,
  };
  app.set("trust proxy", true);
  app.use(session(sessionConfig));

  /**
   * initialize apollo server
   */
  const apolloServer = new ApolloServer({
    debug: false,
    introspection: true,
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

  app.listen(port, () => {
    console.log("Server started on Port", port);
  });
  console.log(env.app.origin);
};

main().catch((err) => console.log(err));
