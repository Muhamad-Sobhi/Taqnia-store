import "server-only";

import { cookies } from "next/headers";

import { findSession, sessionCookieName } from "@/server/auth/session";

export async function getCurrentSession() {
  const token = (await cookies()).get(sessionCookieName)?.value;
  return token ? findSession(token) : null;
}
