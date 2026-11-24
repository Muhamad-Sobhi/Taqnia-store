"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getServerEnv } from "@/config/env";
import { getInvalidEnvironmentVariables } from "@/config/environment-error";
import { getStorefrontCopy } from "@/content/storefront";
import {
  AccountAlreadyExistsError,
  InvalidCredentialsError,
  loginCustomer,
  registerCustomer,
} from "@/server/auth/customer";
import { isLocale } from "@/lib/locale";
import { revokeSession, sessionCookieName, sessionLifetimeSeconds } from "@/server/auth/session";
import { loginSchema, registerCustomerSchema } from "@/server/auth/validation";
import type { AuthFormState } from "@/types/auth";

async function setSessionCookie(token: string) {
  const env = getServerEnv();
  (await cookies()).set(sessionCookieName, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionLifetimeSeconds,
  });
}

function getEnvironmentErrorState(error: unknown, message: string): AuthFormState | null {
  const variables = getInvalidEnvironmentVariables(error);
  if (!variables) {
    return null;
  }

  console.error("Authentication is unavailable because server configuration is invalid.", {
    variables,
  });
  return { error: message };
}

function getLocaleValue(formData: FormData) {
  const value = formData.get("locale");
  return typeof value === "string" && isLocale(value) ? value : null;
}

export async function registerCustomerAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const locale = getLocaleValue(formData);
  if (!locale) {
    return { error: "Invalid locale." };
  }

  const copy = getStorefrontCopy(locale);
  const parsed = registerCustomerSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: copy.authValidationError };
  }

  try {
    const token = await registerCustomer(parsed.data);
    await setSessionCookie(token);
  } catch (error) {
    if (error instanceof AccountAlreadyExistsError) {
      return { error: copy.duplicateAccountError };
    }

    const configurationError = getEnvironmentErrorState(error, copy.authUnavailableError);
    if (configurationError) {
      return configurationError;
    }

    throw error;
  }

  redirect(`/${locale}/account`);
}

export async function loginCustomerAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const locale = getLocaleValue(formData);
  if (!locale) {
    return { error: "Invalid locale." };
  }

  const copy = getStorefrontCopy(locale);
  const parsed = loginSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: copy.authValidationError };
  }

  try {
    const token = await loginCustomer(parsed.data);
    await setSessionCookie(token);
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return { error: copy.invalidCredentialsError };
    }

    const configurationError = getEnvironmentErrorState(error, copy.authUnavailableError);
    if (configurationError) {
      return configurationError;
    }

    throw error;
  }

  redirect(`/${locale}/account`);
}

export async function logoutAction(formData: FormData): Promise<void> {
  const locale = getLocaleValue(formData) ?? "en";
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;
  if (token) {
    await revokeSession(token);
  }

  cookieStore.delete(sessionCookieName);
  redirect(`/${locale}/account/login`);
}
