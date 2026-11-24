import Link from "next/link";

import { adminStoreCopy } from "@/content/admin-store";
import type { Locale } from "@/lib/locale";

export function AdminNavigation({ locale }: Readonly<{ locale: Locale }>) {
  const copy = adminStoreCopy[locale];

  return (
    <header className="admin-navigation">
      <div className="admin-navigation__inner">
        <Link className="admin-navigation__brand" href={`/${locale}/admin`}>
          {copy.admin}
        </Link>
        <nav aria-label={copy.admin}>
          <Link href={`/${locale}/admin`}>{copy.overview}</Link>
          <Link href={`/${locale}/admin/products`}>{copy.products}</Link>
          <Link href={`/${locale}/admin/orders`}>{copy.orders}</Link>
          <Link href={`/${locale}/admin/quotes`}>{copy.quotes}</Link>
        </nav>
      </div>
    </header>
  );
}
