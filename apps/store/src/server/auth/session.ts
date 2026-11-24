import "server-only";

import { createHmac, randomBytes, randomUUID } from "node:crypto";
import { and, eq, gt, isNull } from "drizzle-orm";

import { getServerEnv } from "@/config/env";
import { customerProfiles, roles, sessions, userRoles, users } from "@/server/db/schema";
import { getDatabase } from "@/server/db/connection";

export const sessionCookieName = "taqnia_session";
export const sessionLifetimeSeconds = 60 * 60 * 24 * 30;

export type CurrentSession = Readonly<{
  sessionId: string;
  userId: string;
  customerId: string | null;
  fullName: string | null;
  email: string;
  phone: string;
  roles: readonly string[];
}>;

export function createSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export function fingerprintSessionToken(token: string): string {
  return createHmac("sha256", getServerEnv().SESSION_SECRET).update(token).digest("hex");
}

export async function createSession(userId: string): Promise<string> {
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + sessionLifetimeSeconds * 1000);

  await getDatabase()
    .insert(sessions)
    .values({
      id: randomUUID(),
      userId,
      tokenHash: fingerprintSessionToken(token),
      expiresAt,
    });

  return token;
}

export async function revokeSession(token: string): Promise<void> {
  await getDatabase()
    .update(sessions)
    .set({ revokedAt: new Date() })
    .where(and(eq(sessions.tokenHash, fingerprintSessionToken(token)), isNull(sessions.revokedAt)));
}

export async function findSession(token: string): Promise<CurrentSession | null> {
  const rows = await getDatabase()
    .select({
      sessionId: sessions.id,
      userId: users.id,
      customerId: customerProfiles.id,
      fullName: customerProfiles.fullName,
      email: users.email,
      phone: users.phone,
      status: users.status,
      role: roles.slug,
    })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .leftJoin(customerProfiles, eq(customerProfiles.userId, users.id))
    .leftJoin(userRoles, eq(userRoles.userId, users.id))
    .leftJoin(roles, eq(roles.id, userRoles.roleId))
    .where(
      and(
        eq(sessions.tokenHash, fingerprintSessionToken(token)),
        isNull(sessions.revokedAt),
        gt(sessions.expiresAt, new Date()),
        eq(users.status, "active"),
      ),
    );

  const first = rows[0];
  if (!first) {
    return null;
  }

  return {
    sessionId: first.sessionId,
    userId: first.userId,
    customerId: first.customerId,
    fullName: first.fullName,
    email: first.email,
    phone: first.phone,
    roles: [...new Set(rows.flatMap((row) => (row.role ? [row.role] : [])))],
  };
}
