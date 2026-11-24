import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { adminStoreCopy } from "@/content/admin-store";
import { formatEgp } from "@/lib/currency";
import { isLocale } from "@/lib/locale";
import { requireAdminPagePermission } from "@/server/auth/admin-page-guard";
import { listAdminProducts } from "@/server/services/admin/catalog";

type AdminProductsPageProps = Readonly<{
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string | string[]; page?: string | string[] }>;
}>;

export async function generateMetadata({ params }: AdminProductsPageProps): Promise<Metadata> {
  const { locale: value } = await params;
  if (!isLocale(value)) return {};
  return {
    title: adminStoreCopy[value].products,
    robots: { index: false, follow: false },
  };
}

export default async function AdminProductsPage({ params, searchParams }: AdminProductsPageProps) {
  const [{ locale: value }, query] = await Promise.all([params, searchParams]);
  if (!isLocale(value)) notFound();

  const locale = value;
  await requireAdminPagePermission(locale, "catalog.manage");
  const copy = adminStoreCopy[locale];
  const search = (typeof query.q === "string" ? query.q : "").slice(0, 120);
  const requestedPage = typeof query.page === "string" ? Number(query.page) : 1;
  const products = await listAdminProducts(search, requestedPage);
  const pageHref = (page: number) =>
    `/${locale}/admin/products?${new URLSearchParams({
      ...(search ? { q: search } : {}),
      page: String(page),
    })}`;

  return (
    <main id="main-content" className="admin-page-shell">
      <div className="quote-admin">
        <header className="quote-admin__header">
          <div>
            <p className="quote-admin__eyebrow">{copy.catalogManagement}</p>
            <h1>{copy.products}</h1>
          </div>
          <Link className="button button--primary" href={`/${locale}/admin/products/new`}>
            {copy.newProduct}
          </Link>
        </header>
        <section>
          <form className="admin-filter" method="get">
            <label>
              <span className="visually-hidden">{copy.searchProducts}</span>
              <input
                type="search"
                name="q"
                maxLength={120}
                placeholder={copy.searchProducts}
                defaultValue={search}
              />
            </label>
            <button className="button button--secondary" type="submit">
              {copy.view}
            </button>
          </form>
          {products.items.length === 0 ? (
            <p className="empty-state">{copy.noProducts}</p>
          ) : (
            <div className="admin-table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th scope="col">{copy.product}</th>
                    <th scope="col">{copy.sku}</th>
                    <th scope="col">{copy.priceEgp}</th>
                    <th scope="col">{copy.status}</th>
                    <th scope="col">{copy.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {products.items.map((product) => (
                    <tr key={product.id}>
                      <th scope="row">
                        <span>{locale === "ar" ? product.nameAr : product.nameEn}</span>
                        <small className="admin-table__subtext">{product.slug}</small>
                      </th>
                      <td>{product.sku ?? "—"}</td>
                      <td>
                        {product.priceMinorUnits === null
                          ? "—"
                          : formatEgp(product.priceMinorUnits, locale)}
                      </td>
                      <td>{copy[product.status]}</td>
                      <td>
                        <Link href={`/${locale}/admin/products/${product.id}/edit`}>
                          {copy.edit}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {products.total > 50 ? (
            <nav className="admin-pagination" aria-label={copy.pageOf}>
              {products.page > 1 ? (
                <Link href={pageHref(products.page - 1)}>{copy.previousPage}</Link>
              ) : (
                <span aria-disabled="true">{copy.previousPage}</span>
              )}
              <span>
                {copy.pageOf} {products.page} / {products.pageCount}
              </span>
              {products.page < products.pageCount ? (
                <Link href={pageHref(products.page + 1)}>{copy.nextPage}</Link>
              ) : (
                <span aria-disabled="true">{copy.nextPage}</span>
              )}
            </nav>
          ) : null}
        </section>
      </div>
    </main>
  );
}
