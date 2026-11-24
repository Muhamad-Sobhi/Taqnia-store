import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductForm } from "@/components/features/admin/product-form";
import { adminStoreCopy } from "@/content/admin-store";
import { isLocale } from "@/lib/locale";
import { requireAdminPagePermission } from "@/server/auth/admin-page-guard";
import { getAdminProduct, listAdminProductOptions } from "@/server/services/admin/catalog";

type EditProductPageProps = Readonly<{
  params: Promise<{ locale: string; productId: string }>;
}>;

export async function generateMetadata({ params }: EditProductPageProps): Promise<Metadata> {
  const { locale: value } = await params;
  if (!isLocale(value)) return {};
  return {
    title: adminStoreCopy[value].editProduct,
    robots: { index: false, follow: false },
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { locale: value, productId } = await params;
  if (!isLocale(value)) notFound();
  if (!/^[0-9a-f-]{36}$/i.test(productId)) notFound();

  const locale = value;
  await requireAdminPagePermission(locale, "catalog.manage");
  const [product, options] = await Promise.all([
    getAdminProduct(productId),
    listAdminProductOptions(),
  ]);
  if (!product) notFound();

  return (
    <main id="main-content" className="admin-page-shell">
      <div className="quote-admin">
        <header className="quote-admin__header">
          <h1>{adminStoreCopy[locale].editProduct}</h1>
        </header>
        <section>
          <ProductForm
            locale={locale}
            categories={options.categories}
            brands={options.brands}
            product={product}
          />
        </section>
      </div>
    </main>
  );
}
