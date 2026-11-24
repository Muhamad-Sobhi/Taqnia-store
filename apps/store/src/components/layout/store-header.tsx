import Image from "next/image";
import Link from "next/link";

import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { StoreSearch } from "@/components/layout/store-search";
import { getStorefrontCopy } from "@/content/storefront";
import type { Locale } from "@/lib/locale";

function StoreNavigation({ locale }: Readonly<{ locale: Locale }>) {
  const copy = getStorefrontCopy(locale);
  const links = (
    <>
      <Link href={`/${locale}`}>{copy.homeLabel}</Link>
      <Link href={`/${locale}#categories`}>{copy.categoriesLabel}</Link>
    </>
  );

  return (
    <>
      <nav className="desktop-navigation" aria-label={copy.navigationLabel}>
        {links}
      </nav>
      <details className="mobile-navigation">
        <summary>{copy.navigationLabel}</summary>
        <nav aria-label={copy.navigationLabel}>{links}</nav>
      </details>
    </>
  );
}

export function StoreHeader({ locale }: Readonly<{ locale: Locale }>) {
  const copy = getStorefrontCopy(locale);

  return (
    <header className="store-header">
      <div className="store-header__top">
        <Link className="store-brand" href={`/${locale}`}>
          <Image src="/taqnia-logo.png" alt="" aria-hidden="true" width={96} height={96} priority />
          <span>{copy.storeName}</span>
        </Link>
        <StoreSearch locale={locale} />
        <div className="store-header__actions">
          <Link className="account-link" href={`/${locale}/account`}>
            {copy.accountLabel}
          </Link>
          <LocaleSwitcher locale={locale} />
        </div>
      </div>
      <div className="store-header__navigation">
        <StoreNavigation locale={locale} />
      </div>
    </header>
  );
}
