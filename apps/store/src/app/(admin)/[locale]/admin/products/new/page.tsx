import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductForm } from "@/components/features/admin/product-form";
import { adminStoreCopy } from "@/content/admin-store";
import { isLocale } from "@/lib/locale";
import { requireAdminPagePermission } from "@/server/auth/admin-page-guard";
import { listAdminProductOptions } from "@/server/services/admin/catalog";

type NewProductPageProps = Readonly<{ params: Promise<{ locale: string }> }>;

export async function generateMetadata({ params }: NewProductPageProps): Promise<Metadata> {
  const { locale: value } = await params;
  if (!isLocale(value)) return {};
  return {
    title: adminStoreCopy[value].newProduct,
    robots: { index: false, follow: false },
  };
}

export default async function NewProductPage({ params }: NewProductPageProps) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();

  const locale = value;
  await requireAdminPagePermission(locale, "catalog.manage");
  const [options, copy] = [await listAdminProductOptions(), adminStoreCopy[locale]];
  return (
    <main id="main-content" className="admin-page-shell">
      <div className="quote-admin">
        <header className="quote-admin__header">
          <h1>{copy.newProduct}</h1>
        </header>
        <section>
          <ProductForm locale={locale} categories={options.categories} brands={options.brands} />
        </section>
      </div>
    </main>
  );
}
