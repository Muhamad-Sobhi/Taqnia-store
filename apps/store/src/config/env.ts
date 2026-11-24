import { z } from "zod";

const serverEnvironmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  APP_BASE_URL: z.url(),
  PORT: z.coerce.number().int().min(1).max(65_535).optional(),
  DATABASE_HOST: z.string().min(1),
  DATABASE_PORT: z.coerce.number().int().min(1).max(65_535),
  DATABASE_NAME: z.string().min(1),
  DATABASE_USER: z.string().min(1),
  DATABASE_PASSWORD: z.string().min(1),
  DATABASE_CONNECTION_LIMIT: z.coerce.number().int().min(1).max(20).default(3),
  SESSION_SECRET: z.string().min(32),
  ANALYTICS_ENABLED: z.enum(["true", "false"]).default("false"),
});

const databaseEnvironmentSchema = serverEnvironmentSchema.pick({
  DATABASE_HOST: true,
  DATABASE_PORT: true,
  DATABASE_NAME: true,
  DATABASE_USER: true,
  DATABASE_PASSWORD: true,
});

export type ServerEnvironment = z.infer<typeof serverEnvironmentSchema>;
export type DatabaseEnvironment = z.infer<typeof databaseEnvironmentSchema>;

export function getServerEnv(): ServerEnvironment {
  return serverEnvironmentSchema.parse(process.env);
}

export function getDatabaseEnv(): DatabaseEnvironment {
  return databaseEnvironmentSchema.parse(process.env);
}
