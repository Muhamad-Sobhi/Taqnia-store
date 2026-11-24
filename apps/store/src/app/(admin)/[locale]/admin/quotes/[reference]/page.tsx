import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { QuoteDetails } from "@/components/features/admin/quote-details";
import { adminQuoteCopy } from "@/content/admin-quotes";
import { isLocale } from "@/lib/locale";
import { mockQuotes } from "@/mocks/quote-admin";

type QuoteDetailsPageProps = Readonly<{
  params: Promise<{ locale: string; reference: string }>;
}>;

export async function generateMetadata({ params }: QuoteDetailsPageProps): Promise<Metadata> {
  const { locale: value, reference } = await params;
  if (!isLocale(value)) return {};
  const copy = adminQuoteCopy[value];
  return {
    title: `${copy.quoteDetails} | ${reference}`,
    robots: { index: false, follow: false },
  };
}

export default async function QuoteDetailsPage({ params }: QuoteDetailsPageProps) {
  const { locale: value, reference } = await params;
  if (!isLocale(value)) notFound();

  const quote = mockQuotes.find((item) => item.reference === reference);
  if (!quote) notFound();

  return (
    <main id="main-content" className="admin-page-shell">
      <QuoteDetails locale={value} quote={quote} />
    </main>
  );
}
