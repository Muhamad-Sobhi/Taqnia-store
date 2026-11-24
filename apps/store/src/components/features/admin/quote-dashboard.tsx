"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { adminQuoteCopy } from "@/content/admin-quotes";
import { formatEgp } from "@/lib/currency";
import type { Locale } from "@/lib/locale";
import { mockQuotes, type QuoteStatus } from "@/mocks/quote-admin";

type QuoteDashboardProps = Readonly<{ locale: Locale }>;

const pageSize = 5;

function statusLabel(status: QuoteStatus, locale: Locale): string {
  const copy = adminQuoteCopy[locale];
  const labels: Record<QuoteStatus, string> = {
    new: copy.new,
    under_review: copy.underReview,
    waiting_customer: copy.waitingCustomer,
    approved: copy.approved,
    rejected: copy.rejected,
    archived: copy.archived,
  };
  return labels[status];
}

export function QuoteDashboard({ locale }: QuoteDashboardProps) {
  const copy = adminQuoteCopy[locale];
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<QuoteStatus | "all">("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase(locale);
    const matches = mockQuotes.filter((quote) => {
      const matchesQuery =
        normalized.length === 0 ||
        quote.reference.toLocaleLowerCase(locale).includes(normalized) ||
        quote.customerName.toLocaleLowerCase(locale).includes(normalized);
      const matchesStatus = status === "all" || quote.status === status;
      const date = quote.createdAt.slice(0, 10);
      const matchesFrom = fromDate.length === 0 || date >= fromDate;
      const matchesTo = toDate.length === 0 || date <= toDate;
      return matchesQuery && matchesStatus && matchesFrom && matchesTo;
    });

    return [...matches].sort((left, right) =>
      sort === "newest"
        ? right.createdAt.localeCompare(left.createdAt)
        : left.createdAt.localeCompare(right.createdAt),
    );
  }, [fromDate, locale, query, sort, status, toDate]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const statusCounts = mockQuotes.reduce<Record<QuoteStatus, number>>(
    (counts, quote) => {
      counts[quote.status] += 1;
      return counts;
    },
    { new: 0, under_review: 0, waiting_customer: 0, approved: 0, rejected: 0, archived: 0 },
  );
  const convertedCount = mockQuotes.filter((quote) => quote.mockSalesOrderReference).length;

  const summaryCards: readonly { label: string; value: number }[] = [
    { label: copy.totalQuotes, value: mockQuotes.length },
    { label: copy.new, value: statusCounts.new },
    { label: copy.underReview, value: statusCounts.under_review },
    { label: copy.waitingCustomer, value: statusCounts.waiting_customer },
    { label: copy.approved, value: statusCounts.approved },
    { label: copy.rejected, value: statusCounts.rejected },
    { label: copy.archived, value: statusCounts.archived },
    { label: copy.converted, value: convertedCount },
  ];

  function resetPage() {
    setPage(1);
  }

  return (
    <div className="quote-admin">
      <header className="quote-admin__header">
        <div>
          <p className="quote-admin__eyebrow">{copy.mockDataLabel}</p>
          <h1>{copy.title}</h1>
        </div>
        <span className="quote-admin__prototype-badge">{copy.prototypeWarning}</span>
      </header>

      <p className="quote-admin__warning" role="status">
        {copy.noPersistence} {copy.temporaryChanges}.
      </p>

      <section aria-labelledby="quote-overview-title">
        <h2 id="quote-overview-title">{copy.overview}</h2>
        <div className="quote-summary-grid">
          {summaryCards.map((card) => (
            <article className="quote-summary-card" key={card.label}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="quote-admin__distribution" aria-labelledby="status-distribution-title">
        <h2 id="status-distribution-title">{copy.statusDistribution}</h2>
        <div className="quote-status-bars">
          {(Object.entries(statusCounts) as readonly [QuoteStatus, number][]).map(
            ([quoteStatus, count]) => (
              <div className="quote-status-bar" key={quoteStatus}>
                <span>{statusLabel(quoteStatus, locale)}</span>
                <div aria-label={`${statusLabel(quoteStatus, locale)}: ${count}`}>
                  <i style={{ width: `${(count / mockQuotes.length) * 100}%` }} />
                </div>
                <strong>{count}</strong>
              </div>
            ),
          )}
        </div>
      </section>

      <section aria-labelledby="quote-list-title">
        <h2 id="quote-list-title">{copy.quoteRequests}</h2>
        <div className="quote-filter-grid">
          <label>
            <span>{copy.searchPlaceholder}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                resetPage();
              }}
              placeholder={copy.searchPlaceholder}
            />
          </label>
          <label>
            <span>{copy.status}</span>
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as QuoteStatus | "all");
                resetPage();
              }}
            >
              <option value="all">{copy.all}</option>
              {(
                [
                  "new",
                  "under_review",
                  "waiting_customer",
                  "approved",
                  "rejected",
                  "archived",
                ] as const
              ).map((value) => (
                <option value={value} key={value}>
                  {statusLabel(value, locale)}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{copy.date}</span>
            <input
              type="date"
              value={fromDate}
              onChange={(event) => {
                setFromDate(event.target.value);
                resetPage();
              }}
            />
          </label>
          <label>
            <span className="visually-hidden">{copy.date}</span>
            <input
              type="date"
              value={toDate}
              onChange={(event) => {
                setToDate(event.target.value);
                resetPage();
              }}
            />
          </label>
          <label>
            <span>{copy.sort}</span>
            <select
              value={sort}
              onChange={(event) => {
                setSort(event.target.value as "newest" | "oldest");
                resetPage();
              }}
            >
              <option value="newest">{copy.newest}</option>
              <option value="oldest">{copy.oldest}</option>
            </select>
          </label>
        </div>

        {visible.length === 0 ? (
          <p className="quote-admin__empty" role="status">
            {copy.noQuotes}
          </p>
        ) : (
          <div className="quote-table-wrap">
            <table className="quote-table">
              <thead>
                <tr>
                  <th>{copy.reference}</th>
                  <th>{copy.customer}</th>
                  <th>{copy.productCount}</th>
                  <th>{copy.quantity}</th>
                  <th>{copy.displayedTotal}</th>
                  <th>{copy.confirmedTotal}</th>
                  <th>{copy.status}</th>
                  <th>{copy.assignee}</th>
                  <th>{copy.created}</th>
                  <th>
                    <span className="visually-hidden">{copy.view}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((quote) => {
                  const displayedTotal = quote.lines.reduce(
                    (total, line) => total + line.displayedUnitMinor * line.quantity,
                    0,
                  );
                  const confirmedComplete = quote.lines.every(
                    (line) => line.confirmedUnitMinor !== null,
                  );
                  const confirmedTotal = confirmedComplete
                    ? quote.lines.reduce(
                        (total, line) =>
                          total +
                          (line.confirmedUnitMinor === null ? 0 : line.confirmedUnitMinor) *
                            line.quantity,
                        0,
                      )
                    : null;

                  return (
                    <tr key={quote.reference}>
                      <td>{quote.reference}</td>
                      <td>
                        <strong>{quote.customerName}</strong>
                        <span dir="ltr">{quote.email}</span>
                      </td>
                      <td>{quote.lines.length}</td>
                      <td>{quote.lines.reduce((total, line) => total + line.quantity, 0)}</td>
                      <td>{formatEgp(displayedTotal, locale)}</td>
                      <td>
                        {confirmedTotal === null
                          ? copy.noConfirmedPrices
                          : formatEgp(confirmedTotal, locale)}
                      </td>
                      <td>
                        <span className={`quote-status quote-status--${quote.status}`}>
                          {statusLabel(quote.status, locale)}
                        </span>
                      </td>
                      <td>{quote.assignee}</td>
                      <td>
                        <time dateTime={quote.createdAt}>
                          {new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-EG", {
                            dateStyle: "medium",
                          }).format(new Date(quote.createdAt))}
                        </time>
                      </td>
                      <td>
                        <Link
                          className="button button--secondary"
                          href={`/${locale}/admin/quotes/${quote.reference}`}
                        >
                          {copy.view}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <nav className="quote-pagination" aria-label={copy.quoteRequests}>
          <button
            className="button button--secondary"
            type="button"
            disabled={safePage === 1}
            onClick={() => setPage(safePage - 1)}
          >
            {copy.previous}
          </button>
          <span>
            {safePage} / {pageCount}
          </span>
          <button
            className="button button--secondary"
            type="button"
            disabled={safePage === pageCount}
            onClick={() => setPage(safePage + 1)}
          >
            {copy.next}
          </button>
        </nav>
      </section>

      <section aria-labelledby="recent-activity-title">
        <h2 id="recent-activity-title">{copy.recentActivity}</h2>
        <ul className="quote-activity-list">
          {mockQuotes.slice(0, 4).map((quote) => (
            <li key={quote.reference}>
              <Link href={`/${locale}/admin/quotes/${quote.reference}`}>
                <strong>{quote.reference}</strong>
              </Link>
              <span>{statusLabel(quote.status, locale)}</span>
              <time dateTime={quote.createdAt}>
                {new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-EG", {
                  dateStyle: "medium",
                }).format(new Date(quote.createdAt))}
              </time>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
