import connectPgSimple from "connect-pg-simple";
import cors from "cors";
import express from "express";
import session, { SessionOptions } from "express-session";
import pg from "pg";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { Project, Task, User } from "./entities";
import { env } from "./env";
const pgSession = connectPgSimple(session);

const app = express();

app.use(
  cors({
    origin: [env.app.origin, "http://localhost:3000"],
    credentials: true,
  })
);



//connect to pg db
createConnection({
  type: "postgres",
  database: env.db.database,
  username: env.db.username,
  password: env.db.password,
  logging: env.db.logging,
  synchronize: env.db.synchronize,
  entities: [User, Project, Task],
});

//pool of sessions
const sessionPool = pg.Pool;
const sessionDBaccess = new sessionPool({
  database: env.db.database,
  user: env.db.username,
  password: env.db.password,
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
    maxAge: 5 * 12 * 30 * 24 * 60 * 60 * 1000,
  },
  saveUninitialized: false,
  secret: env.app.cookieSecret,
};

app.use(session(sessionConfig));

export default app;
