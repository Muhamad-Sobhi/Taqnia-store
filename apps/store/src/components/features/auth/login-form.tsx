"use client";

import Link from "next/link";
import { useActionState } from "react";

import { loginCustomerAction } from "@/server/auth/actions";
import { getStorefrontCopy } from "@/content/storefront";
import type { Locale } from "@/lib/locale";

export function LoginForm({ locale }: Readonly<{ locale: Locale }>) {
  const copy = getStorefrontCopy(locale);
  const [state, formAction, pending] = useActionState(loginCustomerAction, { error: null });

  return (
    <section className="auth-panel" aria-labelledby="login-title">
      <h1 id="login-title">{copy.signInTitle}</h1>
      <form action={formAction} className="auth-form">
        <input type="hidden" name="locale" value={locale} />
        <label>
          {copy.emailLabel}
          <input name="email" type="email" autoComplete="email" maxLength={254} required />
        </label>
        <label>
          {copy.passwordLabel}
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            maxLength={128}
            required
          />
        </label>
        {state.error ? (
          <p className="form-error" role="alert">
            {state.error}
          </p>
        ) : null}
        <button className="button button--primary" type="submit" disabled={pending}>
          {copy.signInAction}
        </button>
      </form>
      <p>
        {copy.noAccountLabel} <Link href={`/${locale}/account/register`}>{copy.registerTitle}</Link>
      </p>
      <p>
        <Link href={`/${locale}/account/password-reset`}>{copy.passwordResetLabel}</Link>
      </p>
    </section>
  );
}
