import { randomUUID } from "node:crypto";
import { config } from "dotenv";
import { eq, or } from "drizzle-orm";
import { emitKeypressEvents, type Key } from "node:readline";
import { createInterface } from "node:readline/promises";
import { z } from "zod";

import { hashPassword } from "../src/server/auth/password";
import { getServerEnv } from "../src/config/env";
import {
  getLocalDatabaseEnvironment,
  LocalDatabaseConfigurationError,
} from "../src/config/local-database";
import { closeDatabaseConnection, getDatabase } from "../src/server/db/connection";
import { permissions, roles, userRoles, users, rolePermissions } from "../src/server/db/schema";

config({ path: ".env.local" });
config();

const localAdminEnvironmentSchema = z.object({
  LOCAL_ADMIN_EMAIL: z
    .email()
    .max(254)
    .transform((value) => value.trim().toLowerCase()),
  LOCAL_ADMIN_PHONE: z
    .string()
    .transform((value) => value.trim().replace(/[\s()-]/g, ""))
    .pipe(z.string().regex(/^\+?[0-9]{8,15}$/)),
});

const requiredAdminPermissions = [
  "catalog.manage",
  "inventory.manage",
  "customers.manage",
  "orders.manage",
  "payments.verify",
  "shipping.manage",
  "content.manage",
] as const;

class LocalAdminSetupError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LocalAdminSetupError";
  }
}

async function promptForLocalAdmin() {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new LocalAdminSetupError("Run local administrator setup from an interactive terminal.");
  }

  const readline = createInterface({ input: process.stdin, output: process.stdout });
  let email: string;
  let phone: string;
  try {
    email = await readline.question("Administrator email: ");
    phone = await readline.question("Administrator phone: ");
  } finally {
    readline.close();
  }

  const identity = localAdminEnvironmentSchema.safeParse({
    LOCAL_ADMIN_EMAIL: email,
    LOCAL_ADMIN_PHONE: phone,
  });
  if (!identity.success) {
    const invalidFields = [
      ...new Set(identity.error.issues.map((issue) => issue.path.join("."))),
    ].join(", ");
    throw new LocalAdminSetupError(`Administrator details are invalid: ${invalidFields}`);
  }

  const password = await promptForHiddenPassword();
  const parsedPassword = z.string().min(12).max(128).safeParse(password);
  if (!parsedPassword.success) {
    throw new LocalAdminSetupError("The password must be between 12 and 128 characters.");
  }

  return { ...identity.data, LOCAL_ADMIN_PASSWORD: parsedPassword.data };
}

function promptForHiddenPassword(): Promise<string> {
  const input = process.stdin;
  if (!input.isTTY) {
    return Promise.reject(
      new LocalAdminSetupError("A terminal is required to enter the password securely."),
    );
  }

  emitKeypressEvents(input);

  return new Promise((resolve, reject) => {
    const previousRawMode = input.isRaw;
    let password = "";

    const finish = () => {
      input.off("keypress", onKeypress);
      input.setRawMode(previousRawMode ?? false);
      input.pause();
      process.stdout.write("\n");
    };

    const onKeypress = (character: string, key: Key) => {
      if (key.ctrl && key.name === "c") {
        finish();
        reject(new LocalAdminSetupError("Administrator setup was cancelled."));
        return;
      }
      if (key.name === "return") {
        finish();
        resolve(password);
        return;
      }
      if (key.name === "backspace") {
        password = Array.from(password).slice(0, -1).join("");
        return;
      }
      if (character && !key.ctrl && !key.meta && (!key.name || key.name.length === 1)) {
        password += character;
      }
    };

    input.on("keypress", onKeypress);
    input.setRawMode(true);
    input.resume();
    process.stdout.write("Administrator password (input hidden): ");
  });
}

async function createLocalAdmin() {
  const databaseEnvironment = getLocalDatabaseEnvironment();
  const serverEnvironment = getServerEnv();
  const appUrl = new URL(serverEnvironment.APP_BASE_URL);
  if (
    serverEnvironment.NODE_ENV !== "development" ||
    appUrl.protocol !== "http:" ||
    (appUrl.hostname !== "localhost" && appUrl.hostname !== "127.0.0.1")
  ) {
    throw new LocalAdminSetupError(
      "The local admin tool only runs with an HTTP localhost APP_BASE_URL.",
    );
  }

  if (databaseEnvironment.NODE_ENV !== "development") {
    throw new LocalAdminSetupError("Local administrator setup requires NODE_ENV=development.");
  }

  const parsed = await promptForLocalAdmin();

  const database = getDatabase();
  const passwordHash = await hashPassword(parsed.LOCAL_ADMIN_PASSWORD);

  await database.transaction(async (transaction) => {
    const [adminRole] = await transaction
      .select({ id: roles.id })
      .from(roles)
      .where(eq(roles.slug, "admin"))
      .limit(1)
      .for("update");
    if (!adminRole) {
      throw new LocalAdminSetupError(
        "The admin role is missing; run the local database seed first.",
      );
    }

    const [existingAdmin] = await transaction
      .select({ userId: userRoles.userId })
      .from(userRoles)
      .innerJoin(roles, eq(roles.id, userRoles.roleId))
      .where(eq(roles.slug, "admin"))
      .limit(1);
    if (existingAdmin) {
      throw new LocalAdminSetupError(
        "A local administrator already exists; this utility only creates the first administrator.",
      );
    }

    const grants = await transaction
      .select({ slug: permissions.slug })
      .from(rolePermissions)
      .innerJoin(permissions, eq(permissions.id, rolePermissions.permissionId))
      .where(eq(rolePermissions.roleId, adminRole.id));
    const grantSet = new Set(grants.map((grant) => grant.slug));
    if (!requiredAdminPermissions.every((permission) => grantSet.has(permission))) {
      throw new LocalAdminSetupError(
        "Seeded admin permissions are incomplete; rerun the local database seed.",
      );
    }

    const [existingUser] = await transaction
      .select({ id: users.id })
      .from(users)
      .where(
        or(eq(users.email, parsed.LOCAL_ADMIN_EMAIL), eq(users.phone, parsed.LOCAL_ADMIN_PHONE)),
      )
      .limit(1);
    if (existingUser) {
      throw new LocalAdminSetupError(
        "The supplied local admin email or phone is already registered.",
      );
    }

    const userId = randomUUID();
    await transaction.insert(users).values({
      id: userId,
      email: parsed.LOCAL_ADMIN_EMAIL,
      phone: parsed.LOCAL_ADMIN_PHONE,
      passwordHash,
    });
    await transaction.insert(userRoles).values({ userId, roleId: adminRole.id });
  });

  console.info("Local administrator account created. No password was printed or saved.");
}

async function main() {
  let failure: unknown;
  try {
    await createLocalAdmin();
  } catch (error) {
    failure = error;
  } finally {
    try {
      await closeDatabaseConnection();
    } catch (error) {
      failure ??= error;
    }
  }

  if (failure !== undefined) {
    const message =
      failure instanceof LocalAdminSetupError
        ? failure.message
        : failure instanceof LocalDatabaseConfigurationError
          ? failure.message
          : failure instanceof z.ZodError
            ? `Environment configuration is incomplete or invalid: ${[
                ...new Set(failure.issues.map((issue) => issue.path.join("."))),
              ].join(", ")}`
            : "Unexpected database or runtime error; sensitive details were not printed.";
    console.error(`Local administrator account was not created: ${message}`);
    process.exitCode = 1;
  }
}

void main();
