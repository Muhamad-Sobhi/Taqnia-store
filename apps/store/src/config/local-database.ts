import { z } from "zod";

const localDatabaseEnvironmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test"]),
  DATABASE_HOST: z.string().min(1),
  DATABASE_PORT: z.coerce.number().int().min(1).max(65_535),
  DATABASE_NAME: z.string().min(1),
  DATABASE_USER: z.string().min(1),
  DATABASE_PASSWORD: z.string().min(1),
});

export type LocalDatabaseEnvironment = z.infer<typeof localDatabaseEnvironmentSchema>;

export class LocalDatabaseConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LocalDatabaseConfigurationError";
  }
}

export function getLocalDatabaseEnvironment(
  environment: Readonly<Record<string, string | undefined>> = process.env,
): LocalDatabaseEnvironment {
  const parsed = localDatabaseEnvironmentSchema.safeParse(environment);
  if (!parsed.success) {
    const invalidNames = [
      ...new Set(parsed.error.issues.map((issue) => issue.path.join("."))),
    ].join(", ");
    throw new LocalDatabaseConfigurationError(
      `Local database configuration is incomplete or invalid: ${invalidNames}`,
    );
  }

  const host = parsed.data.DATABASE_HOST.toLowerCase();
  if (!["localhost", "127.0.0.1", "::1"].includes(host)) {
    throw new LocalDatabaseConfigurationError(
      "Local database operations require a loopback MySQL host.",
    );
  }

  const allowedDatabaseName =
    parsed.data.NODE_ENV === "test" ? /(?:_local|_dev|_test)$/i : /(?:_local|_dev)$/i;
  if (!allowedDatabaseName.test(parsed.data.DATABASE_NAME)) {
    throw new LocalDatabaseConfigurationError(
      "Local database operations require a database name ending in _local or _dev; test mode also allows _test.",
    );
  }

  return parsed.data;
}
