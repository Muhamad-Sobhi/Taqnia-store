import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getStorefrontCopy } from "@/content/storefront";
import { isLocale } from "@/lib/locale";

type QuotePageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export async function generateMetadata({ params }: QuotePageProps): Promise<Metadata> {
  const { locale: value } = await params;
  if (!isLocale(value)) {
    return {};
  }

  const copy = getStorefrontCopy(value);
  return {
    title: copy.quotePageTitle.text,
    description: copy.quoteUnavailableMessage.text,
    alternates: {
      canonical: `/${value}/quote`,
      languages: { en: "/en/quote", ar: "/ar/quote" },
    },
    robots: { index: false, follow: true },
  };
}

export default async function QuotePage({ params }: QuotePageProps) {
  const { locale: value } = await params;
  if (!isLocale(value)) {
    notFound();
  }

  const copy = getStorefrontCopy(value);

  return (
    <main id="main-content" className="page-shell">
      <section className="not-found-page" aria-labelledby="quote-title">
        <h1 id="quote-title" data-content-status={copy.quotePageTitle.status}>
          {copy.quotePageTitle.text}
        </h1>
        <p
          className="empty-state"
          role="status"
          data-content-status={copy.quoteUnavailableMessage.status}
        >
          {copy.quoteUnavailableMessage.text}
        </p>
        <Link className="text-link" href={`/${value}`}>
          {copy.homeLabel}
        </Link>
      </section>
    </main>
  );
}
