import Link from "next/link";
import { notFound } from "next/navigation";

import { adminStoreCopy } from "@/content/admin-store";
import { isLocale } from "@/lib/locale";

type AdminHomePageProps = Readonly<{ params: Promise<{ locale: string }> }>;

export default async function AdminHomePage({ params }: AdminHomePageProps) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();

  const copy = adminStoreCopy[value];
  return (
    <main id="main-content" className="admin-page-shell">
      <div className="quote-admin">
        <header className="quote-admin__header">
          <h1>{copy.dashboard}</h1>
        </header>
        <div className="admin-dashboard-grid">
          <Link className="admin-dashboard-card" href={`/${value}/admin/products`}>
            <h2>{copy.catalogManagement}</h2>
            <p>{copy.products}</p>
          </Link>
          <Link className="admin-dashboard-card" href={`/${value}/admin/orders`}>
            <h2>{copy.orderManagement}</h2>
            <p>{copy.orders}</p>
          </Link>
          <Link className="admin-dashboard-card" href={`/${value}/admin/quotes`}>
            <h2>{copy.quotes}</h2>
          </Link>
        </div>
      </div>
    </main>
  );
}
