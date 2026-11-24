import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { OrderControls } from "@/components/features/admin/order-controls";
import { adminStoreCopy, getAdminStatusLabel } from "@/content/admin-store";
import { formatEgp } from "@/lib/currency";
import { isLocale } from "@/lib/locale";
import { hasPermission } from "@/server/auth/authorization";
import { requireAdminPagePermission } from "@/server/auth/admin-page-guard";
import { getAdminOrder } from "@/server/services/admin/orders";

type AdminOrderPageProps = Readonly<{
  params: Promise<{ locale: string; orderNumber: string }>;
}>;

export async function generateMetadata({ params }: AdminOrderPageProps): Promise<Metadata> {
  const { locale: value, orderNumber } = await params;
  if (!isLocale(value)) return {};
  return {
    title: `${adminStoreCopy[value].orderDetails} | ${orderNumber}`,
    robots: { index: false, follow: false },
  };
}

export default async function AdminOrderPage({ params }: AdminOrderPageProps) {
  const { locale: value, orderNumber } = await params;
  if (!isLocale(value)) notFound();
  if (!/^[A-Za-z0-9_-]{1,32}$/.test(orderNumber)) notFound();

  const locale = value;
  await requireAdminPagePermission(locale, "orders.manage");
  const copy = adminStoreCopy[locale];
  const [order, canManageShipping, canVerifyPayments, canAddNotes] = await Promise.all([
    getAdminOrder(orderNumber),
    hasPermission("shipping.manage"),
    hasPermission("payments.verify"),
    hasPermission("orders.manage"),
  ]);
  if (!order) notFound();

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-EG", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  const address = [
    order.streetAddress,
    order.building,
    order.apartment,
    order.cityArea,
    order.governorate,
    order.postalCode,
  ].filter(Boolean);

  return (
    <main id="main-content" className="admin-page-shell">
      <div className="quote-admin">
        <header className="quote-admin__header">
          <div>
            <p className="quote-admin__eyebrow">
              {copy.orderNumber}: {order.orderNumber}
            </p>
            <h1>{copy.orderDetails}</h1>
          </div>
          <Link className="button button--secondary" href={`/${locale}/admin/orders`}>
            {copy.back}
          </Link>
        </header>
        <section>
          <h2>{copy.orderItems}</h2>
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">{copy.product}</th>
                  <th scope="col">{copy.sku}</th>
                  <th scope="col">{copy.quantity}</th>
                  <th scope="col">{copy.unitPrice}</th>
                  <th scope="col">{copy.total}</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <th scope="row">{locale === "ar" ? item.productNameAr : item.productNameEn}</th>
                    <td>{item.sku}</td>
                    <td>{item.quantity}</td>
                    <td>{formatEgp(item.unitPriceMinorUnits, locale)}</td>
                    <td>{formatEgp(item.lineTotalMinorUnits, locale)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row" colSpan={4}>
                    {copy.subtotal}
                  </th>
                  <td>{formatEgp(order.subtotalMinorUnits, locale)}</td>
                </tr>
                <tr>
                  <th scope="row" colSpan={4}>
                    {copy.shippingFee}
                  </th>
                  <td>{formatEgp(order.shippingFeeMinorUnits, locale)}</td>
                </tr>
                <tr>
                  <th scope="row" colSpan={4}>
                    {copy.finalTotal}
                  </th>
                  <td>{formatEgp(order.totalMinorUnits, locale)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
        <div className="admin-dashboard-grid">
          <section>
            <h2>{copy.contact}</h2>
            <dl className="admin-detail-list">
              <dt>{copy.name}</dt>
              <dd>{order.customerName}</dd>
              <dt>{copy.email}</dt>
              <dd>{order.customerEmail}</dd>
              <dt>{copy.phone}</dt>
              <dd>{order.customerPhone}</dd>
              <dt>{copy.createdAt}</dt>
              <dd>{formatDate(order.createdAt)}</dd>
            </dl>
          </section>
          <section>
            <h2>{copy.deliveryAddress}</h2>
            <p>{address.join(", ")}</p>
            {order.deliveryNotes ? <p>{order.deliveryNotes}</p> : null}
            <dl className="admin-detail-list">
              <dt>{copy.shippingMethod}</dt>
              <dd>{order.shippingMethod ?? "—"}</dd>
              <dt>{copy.estimatedDelivery}</dt>
              <dd>{order.estimatedDelivery ?? "—"}</dd>
            </dl>
          </section>
          <section>
            <h2>{copy.paymentMethod}</h2>
            <dl className="admin-detail-list">
              <dt>{copy.paymentMethod}</dt>
              <dd>{getAdminStatusLabel(locale, order.paymentMethod)}</dd>
              <dt>{copy.paymentStatus}</dt>
              <dd>{getAdminStatusLabel(locale, order.paymentStatus)}</dd>
              <dt>{copy.paymentReference}</dt>
              <dd>{order.customerReference ?? "—"}</dd>
              <dt>{copy.verificationNotes}</dt>
              <dd>{order.verificationNotes ?? "—"}</dd>
            </dl>
          </section>
        </div>
        <section>
          <h2>{copy.orderStatusHistory}</h2>
          {order.shippingHistory.length === 0 ? (
            <p className="empty-state">—</p>
          ) : (
            <ol className="admin-history">
              {order.shippingHistory.map((entry) => (
                <li key={entry.id}>
                  <strong>
                    {getAdminStatusLabel(locale, entry.previousStatus)} →{" "}
                    {getAdminStatusLabel(locale, entry.nextStatus)}
                  </strong>
                  <time dateTime={entry.createdAt.toISOString()}>
                    {formatDate(entry.createdAt)}
                  </time>
                  {entry.note ? <p>{entry.note}</p> : null}
                </li>
              ))}
            </ol>
          )}
        </section>
        <section>
          <h2>{copy.paymentStatusHistory}</h2>
          {order.paymentHistory.length === 0 ? (
            <p className="empty-state">—</p>
          ) : (
            <ol className="admin-history">
              {order.paymentHistory.map((entry) => (
                <li key={entry.id}>
                  <strong>
                    {getAdminStatusLabel(locale, entry.previousStatus)} →{" "}
                    {getAdminStatusLabel(locale, entry.nextStatus)}
                  </strong>
                  <time dateTime={entry.createdAt.toISOString()}>
                    {formatDate(entry.createdAt)}
                  </time>
                  {entry.note ? <p>{entry.note}</p> : null}
                </li>
              ))}
            </ol>
          )}
        </section>
        <section>
          <h2>{copy.adminNotes}</h2>
          {order.notes.length === 0 ? (
            <p className="empty-state">—</p>
          ) : (
            <ol className="admin-history">
              {order.notes.map((note) => (
                <li key={note.id}>
                  <time dateTime={note.createdAt.toISOString()}>{formatDate(note.createdAt)}</time>
                  <p>{note.note}</p>
                </li>
              ))}
            </ol>
          )}
        </section>
        <OrderControls
          locale={locale}
          orderNumber={order.orderNumber}
          shippingStatus={order.shippingStatus}
          shippingFeeMinorUnits={order.shippingFeeMinorUnits}
          shippingMethod={order.shippingMethod}
          estimatedDelivery={order.estimatedDelivery}
          deliveryNotes={order.deliveryNotes}
          paymentMethod={order.paymentMethod}
          paymentStatus={order.paymentStatus}
          paymentReference={order.customerReference}
          verificationNotes={order.verificationNotes}
          canManageShipping={canManageShipping}
          canVerifyPayments={canVerifyPayments}
          canAddNotes={canAddNotes}
        />
      </div>
    </main>
  );
}
