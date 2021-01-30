import * as dotenv from "dotenv";

import {
  getOsEnv,
  getOsEnvOptional,
  normalizePort,
  toBool,
  toNumber,
} from "./lib/env";

/**
 * Load .env file or for tests the .env.test file.
 */
dotenv.config();

/**
 * Environment variables
 */
export const env = {
  node: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
  isDevelopment: process.env.NODE_ENV === "development",
  app: {
    port: normalizePort(process.env.PORT!),
    origin: getOsEnv("FRONTEND_ORIGIN"),
    cookieName: getOsEnv("AUTH_COOKIE_NAME"),
    cookieSecret: getOsEnv("COOKIE_SECRET"),
    dirs: {
      /*  migrations: getOsPaths("TYPEORM_MIGRATIONS"),
      migrationsDir: getOsPath("TYPEORM_MIGRATIONS_DIR"),
      entities: getOsPaths("TYPEORM_ENTITIES"),
      entitiesDir: getOsPath("TYPEORM_ENTITIES_DIR"), */
    },
  },

  db: {
    host: getOsEnvOptional("TYPEORM_HOST"),
    url: getOsEnv("TYPEORM_URL"),
    port: toNumber(getOsEnvOptional("TYPEORM_PORT")!),
    username: getOsEnvOptional("TYPEORM_USERNAME"),
    password: getOsEnvOptional("TYPEORM_PASSWORD"),
    database: getOsEnv("TYPEORM_DATABASE"),
    synchronize: toBool(getOsEnvOptional("TYPEORM_SYNCHRONIZE")!),
    logging: toBool(getOsEnv("TYPEORM_LOGGING")),
  },
  graphql: {
    enabled: toBool(getOsEnv("GRAPHQL_ENABLED")),
  },
};
