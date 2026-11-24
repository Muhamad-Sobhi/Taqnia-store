"use client";

import Link from "next/link";
import { useActionState } from "react";

import { registerCustomerAction } from "@/server/auth/actions";
import { getStorefrontCopy } from "@/content/storefront";
import type { Locale } from "@/lib/locale";

export function RegistrationForm({ locale }: Readonly<{ locale: Locale }>) {
  const copy = getStorefrontCopy(locale);
  const [state, formAction, pending] = useActionState(registerCustomerAction, { error: null });

  return (
    <section className="auth-panel" aria-labelledby="registration-title">
      <h1 id="registration-title">{copy.registerTitle}</h1>
      <form action={formAction} className="auth-form">
        <input type="hidden" name="locale" value={locale} />
        <label>
          {copy.fullNameLabel}
          <input
            name="fullName"
            type="text"
            autoComplete="name"
            minLength={2}
            maxLength={160}
            required
          />
        </label>
        <label>
          {copy.emailLabel}
          <input name="email" type="email" autoComplete="email" maxLength={254} required />
        </label>
        <label>
          {copy.phoneLabel}
          <input name="phone" type="tel" autoComplete="tel" maxLength={24} required />
        </label>
        <label>
          {copy.passwordLabel}
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={12}
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
          {copy.registerAction}
        </button>
      </form>
      <p>
        {copy.hasAccountLabel} <Link href={`/${locale}/account/login`}>{copy.signInTitle}</Link>
      </p>
    </section>
  );
}
