import { notFound } from "next/navigation";

import { getStorefrontCopy } from "@/content/storefront";
import { isLocale } from "@/lib/locale";

type PasswordResetPageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export default async function PasswordResetPage({ params }: PasswordResetPageProps) {
  const { locale: value } = await params;
  if (!isLocale(value)) {
    notFound();
  }

  const copy = getStorefrontCopy(value);

  return (
    <main id="main-content" className="page-shell">
      <section className="auth-panel" aria-labelledby="password-reset-title">
        <h1 id="password-reset-title">{copy.passwordResetLabel}</h1>
        <p>{copy.passwordResetUnavailable}</p>
      </section>
    </main>
  );
}
