import "server-only";

import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";

import { getDatabase } from "@/server/db/connection";
import { customerProfiles, roles, sessions, userRoles, users } from "@/server/db/schema";
import type { LoginInput, RegisterCustomerInput } from "@/server/auth/validation";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import {
  createSession,
  createSessionToken,
  fingerprintSessionToken,
  sessionLifetimeSeconds,
} from "@/server/auth/session";

export class AccountAlreadyExistsError extends Error {
  constructor() {
    super("An account with this email address or phone number already exists.");
    this.name = "AccountAlreadyExistsError";
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super("The email address or password is incorrect.");
    this.name = "InvalidCredentialsError";
  }
}

function isDuplicateEntryError(error: unknown): boolean {
  return (
    typeof error === "object" && error !== null && "code" in error && error.code === "ER_DUP_ENTRY"
  );
}

export async function registerCustomer(input: RegisterCustomerInput): Promise<string> {
  const database = getDatabase();
  const userId = randomUUID();
  const profileId = randomUUID();
  const sessionToken = createSessionToken();
  const expiresAt = new Date(Date.now() + sessionLifetimeSeconds * 1000);
  const passwordHash = await hashPassword(input.password);

  try {
    await database.transaction(async (transaction) => {
      const [customerRole] = await transaction
        .select({ id: roles.id })
        .from(roles)
        .where(eq(roles.slug, "customer"))
        .limit(1);

      if (!customerRole) {
        throw new Error("Customer role is missing; run the database seed command.");
      }

      await transaction.insert(users).values({
        id: userId,
        email: input.email,
        phone: input.phone,
        passwordHash,
      });

      await transaction.insert(customerProfiles).values({
        id: profileId,
        userId,
        fullName: input.fullName,
      });

      await transaction.insert(userRoles).values({
        userId,
        roleId: customerRole.id,
      });

      await transaction.insert(sessions).values({
        id: randomUUID(),
        userId,
        tokenHash: fingerprintSessionToken(sessionToken),
        expiresAt,
      });
    });
  } catch (error) {
    if (isDuplicateEntryError(error)) {
      throw new AccountAlreadyExistsError();
    }

    throw error;
  }

  return sessionToken;
}

export async function loginCustomer(input: LoginInput): Promise<string> {
  const [user] = await getDatabase()
    .select({
      id: users.id,
      passwordHash: users.passwordHash,
      status: users.status,
    })
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1);

  let passwordMatches = false;
  if (user) {
    passwordMatches = await verifyPassword(input.password, user.passwordHash);
  } else {
    await hashPassword(input.password.padEnd(12, "\u0000"));
  }

  if (!user || user.status !== "active" || !passwordMatches) {
    throw new InvalidCredentialsError();
  }

  return createSession(user.id);
}
