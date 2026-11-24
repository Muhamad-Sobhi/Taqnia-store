import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { categories } from "@/content/categories";
import { products } from "@/content/products";
import { getStorefrontCopy } from "@/content/storefront";
import { CategoryGrid } from "@/components/features/category-grid";
import { ProductGrid } from "@/components/features/product-grid";
import { isLocale } from "@/lib/locale";

type StorefrontPageProps = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export async function generateMetadata({ params }: StorefrontPageProps): Promise<Metadata> {
  const { locale: value } = await params;
  if (!isLocale(value)) {
    return {};
  }

  const copy = getStorefrontCopy(value);
  return {
    alternates: {
      canonical: `/${value}`,
      languages: { en: "/en", ar: "/ar" },
    },
    description: copy.heroDescription.text,
  };
}

export default async function StorefrontPage({ params }: StorefrontPageProps) {
  const { locale: value } = await params;
  if (!isLocale(value)) {
    notFound();
  }

  const copy = getStorefrontCopy(value);

  return (
    <main id="main-content" className="page-shell">
      <section className="store-hero" aria-labelledby="store-hero-title">
        <p className="store-hero__eyebrow">{copy.heroEyebrow}</p>
        <h1 id="store-hero-title">{copy.heroTitle}</h1>
        <p className="store-hero__description" data-content-status={copy.heroDescription.status}>
          {copy.heroDescription.text}
        </p>
        <a className="button button--light" href="#categories">
          {copy.heroAction}
        </a>
      </section>

      <section id="categories" className="store-section" aria-labelledby="categories-title">
        <div className="section-heading">
          <div>
            <h2 id="categories-title">{copy.categoriesTitle}</h2>
            <p>{copy.categoriesDescription}</p>
          </div>
        </div>
        <CategoryGrid categories={categories} locale={value} />
      </section>

      {products.length > 0 ? (
        <section className="store-section" aria-labelledby="products-title">
          <h2 id="products-title">{copy.productsTitle}</h2>
          <ProductGrid products={products} locale={value} />
        </section>
      ) : (
        <section
          className="catalog-empty-state"
          aria-labelledby="catalog-empty-title"
          aria-describedby="catalog-empty-description"
        >
          <h2 id="catalog-empty-title" data-content-status={copy.catalogEmptyState.title.status}>
            {copy.catalogEmptyState.title.text}
          </h2>
          <p
            id="catalog-empty-description"
            data-content-status={copy.catalogEmptyState.description.status}
          >
            {copy.catalogEmptyState.description.text}
          </p>
        </section>
      )}
    </main>
  );
}
