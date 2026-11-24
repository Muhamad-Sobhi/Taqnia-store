"use client";

import Link from "next/link";
import { useState } from "react";

import { adminQuoteCopy } from "@/content/admin-quotes";
import { formatEgp } from "@/lib/currency";
import type { Locale } from "@/lib/locale";
import {
  getNextStatuses,
  type MockQuote,
  type QuoteStatus,
  type QuoteStatusHistory,
} from "@/mocks/quote-admin";

type QuoteDetailsProps = Readonly<{ locale: Locale; quote: MockQuote }>;

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

function channelLabel(channel: "phone" | "whatsapp" | "email", locale: Locale): string {
  const copy = adminQuoteCopy[locale];
  if (channel === "phone") return copy.phoneCall;
  if (channel === "whatsapp") return copy.whatsapp;
  return copy.emailChannel;
}

function formatSignedEgp(diffMinor: number, locale: Locale): string {
  const sign = diffMinor < 0 ? "-" : diffMinor > 0 ? "+" : "";
  return `${sign}${formatEgp(Math.abs(diffMinor), locale)}`;
}

export function QuoteDetails({ locale, quote }: QuoteDetailsProps) {
  const copy = adminQuoteCopy[locale];
  const [confirmedMinor, setConfirmedMinor] = useState<readonly number[]>(
    quote.lines.map((line) => line.confirmedUnitMinor ?? line.displayedUnitMinor),
  );
  const [confirmedComplete, setConfirmedComplete] = useState<readonly boolean[]>(
    quote.lines.map((line) => line.confirmedUnitMinor !== null),
  );
  const [status, setStatus] = useState<QuoteStatus>(quote.status);
  const [statusHistory, setStatusHistory] = useState<readonly QuoteStatusHistory[]>(
    quote.statusHistory,
  );
  const [temporaryNotes, setTemporaryNotes] = useState<readonly string[]>([]);
  const [noteDraft, setNoteDraft] = useState("");

  const displayedTotal = quote.lines.reduce(
    (total, line) => total + line.displayedUnitMinor * line.quantity,
    0,
  );
  const confirmedTotal = quote.lines.reduce(
    (total, line, index) => total + (confirmedMinor[index] ?? 0) * line.quantity,
    0,
  );
  const allPricesConfirmed = quote.lines.every((line, index) => confirmedComplete[index] === true);
  const eligible =
    status === "approved" &&
    quote.customerApproved &&
    allPricesConfirmed &&
    quote.mockSalesOrderReference === null;

  function applyStatus(nextStatus: QuoteStatus) {
    if (!getNextStatuses(status).includes(nextStatus)) return;
    setStatus(nextStatus);
    setStatusHistory((current) => [
      ...current,
      {
        status: nextStatus,
        dateTime: new Date().toISOString(),
        employee: "Fictional Employee A",
        note: "Temporary local prototype status change.",
      },
    ]);
  }

  function addTemporaryNote() {
    const text = noteDraft.trim();
    if (!text) return;
    setTemporaryNotes((current) => [...current, text]);
    setNoteDraft("");
  }

  return (
    <div className="quote-admin quote-details">
      <header className="quote-admin__header">
        <div>
          <p className="quote-admin__eyebrow">{copy.mockDataLabel}</p>
          <h1>{copy.quoteDetails}</h1>
        </div>
        <span className="quote-admin__prototype-badge">{copy.prototypeWarning}</span>
      </header>

      <p className="quote-admin__warning" role="status">
        {copy.noPersistence} {copy.temporaryChanges}.
      </p>

      <Link className="button button--secondary" href={`/${locale}/admin/quotes`}>
        {copy.backToQuotes}
      </Link>

      <div className="quote-detail-grid">
        <section aria-labelledby="quote-info-title">
          <h2 id="quote-info-title">{copy.quoteInformation}</h2>
          <dl className="quote-detail-list">
            <div>
              <dt>{copy.reference}</dt>
              <dd>{quote.reference}</dd>
            </div>
            <div>
              <dt>{copy.created}</dt>
              <dd>
                <time dateTime={quote.createdAt}>
                  {new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-EG", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(quote.createdAt))}
                </time>
              </dd>
            </div>
            <div>
              <dt>{copy.currentStatus}</dt>
              <dd>
                <span className={`quote-status quote-status--${status}`}>
                  {statusLabel(status, locale)}
                </span>
              </dd>
            </div>
            <div>
              <dt>{copy.assignee}</dt>
              <dd>{quote.assignee}</dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="customer-info-title">
          <h2 id="customer-info-title">{copy.customerInformation}</h2>
          <dl className="quote-detail-list">
            <div>
              <dt>{copy.name}</dt>
              <dd>{quote.customerName}</dd>
            </div>
            <div>
              <dt>{copy.company}</dt>
              <dd>{quote.companyName}</dd>
            </div>
            <div>
              <dt>{copy.email}</dt>
              <dd dir="ltr">{quote.email}</dd>
            </div>
            <div>
              <dt>{copy.phone}</dt>
              <dd dir="ltr">{quote.phone}</dd>
            </div>
          </dl>
        </section>
      </div>

      <section aria-labelledby="requested-products-title">
        <h2 id="requested-products-title">{copy.requestedProducts}</h2>
        <h3>{copy.pricingReview}</h3>
        <div className="quote-table-wrap">
          <table className="quote-table quote-line-table">
            <thead>
              <tr>
                <th>{copy.product}</th>
                <th>{copy.sku}</th>
                <th>{copy.requestedQuantity}</th>
                <th>{copy.displayedUnitPrice}</th>
                <th>{copy.displayedSubtotal}</th>
                <th>{copy.confirmedUnitPrice}</th>
                <th>{copy.confirmedSubtotal}</th>
              </tr>
            </thead>
            <tbody>
              {quote.lines.map((line, index) => (
                <tr key={line.sku}>
                  <td>{line.productName}</td>
                  <td>{line.sku}</td>
                  <td>{line.quantity}</td>
                  <td>{formatEgp(line.displayedUnitMinor, locale)}</td>
                  <td>{formatEgp(line.displayedUnitMinor * line.quantity, locale)}</td>
                  <td>
                    <label>
                      <span className="visually-hidden">{copy.confirmedUnitPrice}</span>
                      <input
                        className="quote-price-input"
                        type="number"
                        min="0"
                        step="1"
                        aria-label={`${copy.confirmedUnitPrice}: ${line.productName}`}
                        value={Math.round((confirmedMinor[index] ?? 0) / 100)}
                        onChange={(event) => {
                          const pounds = event.target.valueAsNumber;
                          if (!Number.isFinite(pounds) || pounds < 0) return;
                          setConfirmedMinor((current) =>
                            current.map((value, valueIndex) =>
                              valueIndex === index ? Math.round(pounds * 100) : value,
                            ),
                          );
                          setConfirmedComplete((current) =>
                            current.map((value, valueIndex) =>
                              valueIndex === index ? true : value,
                            ),
                          );
                        }}
                      />
                    </label>
                  </td>
                  <td>{formatEgp((confirmedMinor[index] ?? 0) * line.quantity, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="quote-price-summary">
          <div>
            <span>{copy.displayedTotalLabel}</span>
            <strong>{formatEgp(displayedTotal, locale)}</strong>
          </div>
          <div>
            <span>{copy.confirmedTotalLabel}</span>
            <strong>{formatEgp(confirmedTotal, locale)}</strong>
          </div>
          <div>
            <span>{copy.priceDifference}</span>
            <strong>{formatSignedEgp(confirmedTotal - displayedTotal, locale)}</strong>
          </div>
        </div>
        <p className="quote-admin__warning" role="status">
          {copy.temporaryWarning}
        </p>
      </section>

      <div className="quote-detail-grid">
        <section aria-labelledby="status-title">
          <h2 id="status-title">{copy.statusActivity}</h2>
          <p>
            <strong>{copy.currentStatus}: </strong>
            {statusLabel(status, locale)}
          </p>
          <h3>{copy.nextTransitions}</h3>
          <div className="quote-transition-list">
            {getNextStatuses(status).map((nextStatus) => (
              <button
                className="button button--secondary"
                type="button"
                key={nextStatus}
                onClick={() => applyStatus(nextStatus)}
              >
                {statusLabel(nextStatus, locale)}
              </button>
            ))}
          </div>
          <h3>{copy.statusHistory}</h3>
          <ol className="quote-timeline">
            {statusHistory.map((item, index) => (
              <li key={`${item.status}-${item.dateTime}-${index}`}>
                <strong>{statusLabel(item.status, locale)}</strong>
                <time dateTime={item.dateTime}>
                  {new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-EG", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(item.dateTime))}
                </time>
                <span>
                  {item.employee}: {item.note}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="communication-title">
          <h2 id="communication-title">{copy.communicationHistory}</h2>
          {quote.communications.length === 0 ? (
            <p>{copy.noQuotes}</p>
          ) : (
            <ol className="quote-timeline">
              {quote.communications.map((communication) => (
                <li key={communication.id}>
                  <strong>{channelLabel(communication.channel, locale)}</strong>
                  <time dateTime={communication.dateTime}>
                    {new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-EG", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(communication.dateTime))}
                  </time>
                  <span>{communication.summary}</span>
                  <span>
                    {copy.employee}: {communication.employee}
                  </span>
                  <span>
                    {copy.outcome}: {communication.outcome}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      <div className="quote-detail-grid">
        <section aria-labelledby="notes-title">
          <h2 id="notes-title">{copy.internalNotes}</h2>
          <ul className="quote-notes">
            {quote.notes.map((note) => (
              <li key={note.id}>
                <strong>{note.employee}</strong>
                <time dateTime={note.dateTime}>{note.dateTime}</time>
                <p>{note.text}</p>
              </li>
            ))}
            {temporaryNotes.map((note, index) => (
              <li key={`temporary-note-${index}`}>
                <strong>Fictional Employee A</strong>
                <p>{note}</p>
              </li>
            ))}
          </ul>
          <label>
            <span className="visually-hidden">{copy.addNotePlaceholder}</span>
            <textarea
              value={noteDraft}
              onChange={(event) => setNoteDraft(event.target.value)}
              placeholder={copy.addNotePlaceholder}
              rows={3}
            />
          </label>
          <button
            className="button button--secondary"
            type="button"
            onClick={addTemporaryNote}
            disabled={noteDraft.trim().length === 0}
          >
            {copy.addTemporaryNote}
          </button>
          <p role="status">{copy.noteWarning}</p>
        </section>

        <section aria-labelledby="conversion-title">
          <h2 id="conversion-title">{copy.conversionPreview}</h2>
          <h3>{copy.conversionProducts}</h3>
          <ul>
            {quote.lines.map((line) => (
              <li key={line.sku}>
                {line.productName} — {line.quantity} ×{" "}
                {formatEgp(confirmedMinor[quote.lines.indexOf(line)] ?? 0, locale)}
              </li>
            ))}
          </ul>
          <h3>{copy.conversionCustomer}</h3>
          <p>
            {quote.customerName} · {quote.companyName}
          </p>
          <h3>{copy.conversionEligibility}</h3>
          {eligible ? (
            <p className="quote-conversion-ok">{copy.eligible}</p>
          ) : (
            <ul className="quote-conversion-blockers">
              {!quote.customerApproved && <li>{copy.customerApprovalRequired}</li>}
              {quote.mockSalesOrderReference && <li>{copy.alreadyConverted}</li>}
              {!allPricesConfirmed && <li>{copy.noConfirmedPrices}</li>}
              {status !== "approved" && <li>{copy.blocked}</li>}
            </ul>
          )}
          {quote.mockSalesOrderReference && (
            <p>
              {copy.salesOrderReference}: <strong>{quote.mockSalesOrderReference}</strong>
            </p>
          )}
          <button className="button button--primary" type="button" disabled>
            {copy.conversionDisabled}
          </button>
        </section>
      </div>
    </div>
  );
}
