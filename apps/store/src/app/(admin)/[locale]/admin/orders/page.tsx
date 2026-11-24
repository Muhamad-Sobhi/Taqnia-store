import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { adminStoreCopy, getAdminStatusLabel } from "@/content/admin-store";
import { formatEgp } from "@/lib/currency";
import { isLocale } from "@/lib/locale";
import type { ShippingStatus } from "@/lib/order-workflow";
import { requireAdminPagePermission } from "@/server/auth/admin-page-guard";
import { listAdminOrders } from "@/server/services/admin/orders";

type AdminOrdersPageProps = Readonly<{
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string | string[]; page?: string | string[] }>;
}>;

const shippingStatuses: readonly ShippingStatus[] = [
  "pending_confirmation",
  "shipping_details_confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export async function generateMetadata({ params }: AdminOrdersPageProps): Promise<Metadata> {
  const { locale: value } = await params;
  if (!isLocale(value)) return {};
  return {
    title: adminStoreCopy[value].orders,
    robots: { index: false, follow: false },
  };
}

export default async function AdminOrdersPage({ params, searchParams }: AdminOrdersPageProps) {
  const [{ locale: value }, query] = await Promise.all([params, searchParams]);
  if (!isLocale(value)) notFound();

  const locale = value;
  await requireAdminPagePermission(locale, "orders.manage");
  const copy = adminStoreCopy[locale];
  const filter =
    typeof query.status === "string"
      ? shippingStatuses.find((status) => status === query.status)
      : undefined;
  const requestedPage = typeof query.page === "string" ? Number(query.page) : 1;
  const orders = await listAdminOrders(filter, requestedPage);
  const pageHref = (page: number) =>
    `/${locale}/admin/orders?${new URLSearchParams({
      ...(filter ? { status: filter } : {}),
      page: String(page),
    })}`;

  return (
    <main id="main-content" className="admin-page-shell">
      <div className="quote-admin">
        <header className="quote-admin__header">
          <div>
            <p className="quote-admin__eyebrow">{copy.orderManagement}</p>
            <h1>{copy.ordersTitle}</h1>
          </div>
        </header>
        <section>
          <form method="get" className="admin-filter">
            <label>
              <span>{copy.filterStatus}</span>
              <select name="status" defaultValue={filter ?? ""}>
                <option value="">{copy.allStatuses}</option>
                {shippingStatuses.map((status) => (
                  <option key={status} value={status}>
                    {getAdminStatusLabel(locale, status)}
                  </option>
                ))}
              </select>
            </label>
            <button className="button button--secondary" type="submit">
              {copy.view}
            </button>
          </form>
          {orders.items.length === 0 ? (
            <p className="empty-state">{copy.noOrders}</p>
          ) : (
            <div className="admin-table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th scope="col">{copy.orderNumber}</th>
                    <th scope="col">{copy.customer}</th>
                    <th scope="col">{copy.total}</th>
                    <th scope="col">{copy.shippingStatus}</th>
                    <th scope="col">{copy.paymentStatus}</th>
                    <th scope="col">{copy.createdAt}</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.items.map((order) => (
                    <tr key={order.id}>
                      <th scope="row">
                        <Link href={`/${locale}/admin/orders/${order.orderNumber}`}>
                          {order.orderNumber}
                        </Link>
                      </th>
                      <td>
                        {order.customerName}
                        <small className="admin-table__subtext">{order.customerEmail}</small>
                      </td>
                      <td>{formatEgp(order.totalMinorUnits, locale)}</td>
                      <td>{getAdminStatusLabel(locale, order.shippingStatus)}</td>
                      <td>{getAdminStatusLabel(locale, order.paymentStatus)}</td>
                      <td>
                        {new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-EG", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {orders.total > 50 ? (
            <nav className="admin-pagination" aria-label={copy.pageOf}>
              {orders.page > 1 ? (
                <Link href={pageHref(orders.page - 1)}>{copy.previousPage}</Link>
              ) : (
                <span aria-disabled="true">{copy.previousPage}</span>
              )}
              <span>
                {copy.pageOf} {orders.page} / {orders.pageCount}
              </span>
              {orders.page < orders.pageCount ? (
                <Link href={pageHref(orders.page + 1)}>{copy.nextPage}</Link>
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
