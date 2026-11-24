import "server-only";

import { notFound, redirect } from "next/navigation";

import type { Locale } from "@/lib/locale";
import {
  AuthenticationRequiredError,
  PermissionDeniedError,
  requirePermission,
} from "@/server/auth/authorization";
import type { CurrentSession } from "@/server/auth/session";

export async function requireAdminPagePermission(locale: Locale, permission: string) {
  let session: CurrentSession;
  try {
    session = await requirePermission(permission);
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) {
      redirect(`/${locale}/account/login`);
    }
    if (error instanceof PermissionDeniedError) {
      notFound();
    }
    throw error;
  }

  if (!session.roles.includes("admin")) notFound();
}
