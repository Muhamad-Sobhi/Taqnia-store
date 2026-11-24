import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { QuoteDashboard } from "@/components/features/admin/quote-dashboard";
import { adminQuoteCopy } from "@/content/admin-quotes";
import { isLocale } from "@/lib/locale";

type QuoteDashboardPageProps = Readonly<{ params: Promise<{ locale: string }> }>;

export async function generateMetadata({ params }: QuoteDashboardPageProps): Promise<Metadata> {
  const { locale: value } = await params;
  if (!isLocale(value)) return {};
  const copy = adminQuoteCopy[value];
  return {
    title: copy.title,
    description: copy.prototypeWarning,
    robots: { index: false, follow: false },
  };
}

export default async function QuoteDashboardPage({ params }: QuoteDashboardPageProps) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  return (
    <main id="main-content" className="admin-page-shell">
      <QuoteDashboard locale={value} />
    </main>
  );
}
