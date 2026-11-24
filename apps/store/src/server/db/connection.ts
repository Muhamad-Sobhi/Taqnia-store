import "server-only";

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import { getServerEnv } from "@/config/env";
import * as schema from "@/server/db/schema";

let connectionPool: mysql.Pool | undefined;

function createConnectionPool() {
  const env = getServerEnv();

  return mysql.createPool({
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
    connectionLimit: env.DATABASE_CONNECTION_LIMIT,
    maxIdle: env.DATABASE_CONNECTION_LIMIT,
    idleTimeout: 60_000,
    connectTimeout: 10_000,
    waitForConnections: true,
    queueLimit: env.DATABASE_CONNECTION_LIMIT * 4,
    charset: "utf8mb4",
    enableKeepAlive: true,
  });
}

export function getConnectionPool() {
  connectionPool ??= createConnectionPool();
  return connectionPool;
}

function createDatabase() {
  return drizzle(getConnectionPool(), { schema, mode: "default" });
}

let database: ReturnType<typeof createDatabase> | undefined;

export function getDatabase() {
  database ??= createDatabase();
  return database;
}

export async function closeDatabaseConnection() {
  if (connectionPool) {
    await connectionPool.end();
    connectionPool = undefined;
    database = undefined;
  }
}
