"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { getStorefrontCopy } from "@/content/storefront";
import type { Locale } from "@/lib/locale";

export function LocaleSwitcher({ locale }: Readonly<{ locale: Locale }>) {
  const pathname = usePathname() ?? `/${locale}`;
  const targetLocale: Locale = locale === "en" ? "ar" : "en";
  const localizedPath = pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${targetLocale}`);
  const copy = getStorefrontCopy(locale);
  const label = targetLocale === "ar" ? copy.switchToArabic : copy.switchToEnglish;

  return (
    <Suspense fallback={<LocaleLink href={localizedPath} locale={targetLocale} label={label} />}>
      <LocaleLinkWithSearch href={localizedPath} locale={targetLocale} label={label} />
    </Suspense>
  );
}

function LocaleLink({
  href,
  locale,
  label,
}: Readonly<{ href: string; locale: Locale; label: string }>) {
  return (
    <Link
      className="locale-switcher"
      href={href}
      hrefLang={locale}
      lang={locale}
      aria-label={label}
    >
      {label}
    </Link>
  );
}

function LocaleLinkWithSearch({
  href,
  locale,
  label,
}: Readonly<{ href: string; locale: Locale; label: string }>) {
  const search = useSearchParams().toString();
  const localizedHref = search ? `${href}?${search}` : href;

  return <LocaleLink href={localizedHref} locale={locale} label={label} />;
}
