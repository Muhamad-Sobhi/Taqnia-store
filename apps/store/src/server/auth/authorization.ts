import "server-only";

import { and, eq } from "drizzle-orm";

import { getCurrentSession } from "@/server/auth/current-user";
import { getDatabase } from "@/server/db/connection";
import { permissions, rolePermissions, userRoles } from "@/server/db/schema";
import type { CurrentSession } from "@/server/auth/session";

export class AuthenticationRequiredError extends Error {
  constructor() {
    super("Authentication is required for this operation.");
    this.name = "AuthenticationRequiredError";
  }
}

export class PermissionDeniedError extends Error {
  constructor(permission: string) {
    super(`The current user does not have permission: ${permission}.`);
    this.name = "PermissionDeniedError";
  }
}

export async function requireCustomerSession(): Promise<CurrentSession> {
  const session = await getCurrentSession();
  if (!session) {
    throw new AuthenticationRequiredError();
  }
  if (!session.customerId || !session.roles.includes("customer")) {
    throw new PermissionDeniedError("customer");
  }

  return session;
}

export async function requirePermission(permissionSlug: string): Promise<CurrentSession> {
  const session = await getCurrentSession();
  if (!session) {
    throw new AuthenticationRequiredError();
  }
  if (!session.roles.includes("admin")) {
    throw new PermissionDeniedError(permissionSlug);
  }

  const [grant] = await getDatabase()
    .select({ permissionId: permissions.id })
    .from(userRoles)
    .innerJoin(rolePermissions, eq(rolePermissions.roleId, userRoles.roleId))
    .innerJoin(permissions, eq(permissions.id, rolePermissions.permissionId))
    .where(and(eq(userRoles.userId, session.userId), eq(permissions.slug, permissionSlug)))
    .limit(1);

  if (!grant) {
    throw new PermissionDeniedError(permissionSlug);
  }

  return session;
}

export async function hasPermission(permissionSlug: string): Promise<boolean> {
  const session = await getCurrentSession();
  if (!session || !session.roles.includes("admin")) return false;

  const [grant] = await getDatabase()
    .select({ permissionId: permissions.id })
    .from(userRoles)
    .innerJoin(rolePermissions, eq(rolePermissions.roleId, userRoles.roleId))
    .innerJoin(permissions, eq(permissions.id, rolePermissions.permissionId))
    .where(and(eq(userRoles.userId, session.userId), eq(permissions.slug, permissionSlug)))
    .limit(1);

  return Boolean(grant);
}
