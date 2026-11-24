import type { Metadata } from "next";
import Link from "next/link";

import { categories } from "@/content/categories";
import { products } from "@/content/products";
import { getStorefrontCopy } from "@/content/storefront";
import { CategoryGrid } from "@/components/features/category-grid";
import { ProductGrid } from "@/components/features/product-grid";
import { isLocale } from "@/lib/locale";
import { notFound } from "next/navigation";

type SearchPageProps = Readonly<{
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string | string[] }>;
}>;

export async function generateMetadata({ params }: SearchPageProps): Promise<Metadata> {
  const { locale: value } = await params;
  return isLocale(value)
    ? { title: getStorefrontCopy(value).searchTitle, robots: { index: false, follow: true } }
    : {};
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const [{ locale: value }, query] = await Promise.all([params, searchParams]);
  if (!isLocale(value)) {
    notFound();
  }

  const searchTerm = typeof query.q === "string" ? query.q.trim() : "";
  const normalizedTerm = searchTerm.toLocaleLowerCase(value);
  const matchingCategories = searchTerm
    ? categories.filter((category) =>
        category.name[value].toLocaleLowerCase(value).includes(normalizedTerm),
      )
    : [];
  const matchingProducts = searchTerm
    ? products.filter((product) => {
        const category = categories.find((item) => item.slug === product.categorySlug);
        return (
          product.name[value].toLocaleLowerCase(value).includes(normalizedTerm) ||
          product.description[value].toLocaleLowerCase(value).includes(normalizedTerm) ||
          category?.name[value].toLocaleLowerCase(value).includes(normalizedTerm)
        );
      })
    : [];
  const copy = getStorefrontCopy(value);
  const hasSearchResults = matchingCategories.length > 0 || matchingProducts.length > 0;
  const hasSearchTerm = searchTerm.length > 0;

  return (
    <main id="main-content" className="page-shell">
      <section className="store-section" aria-labelledby="search-title">
        <h1 id="search-title">{copy.searchTitle}</h1>
        {searchTerm ? <p>{searchTerm}</p> : <p>{copy.searchEnterQuery}</p>}
        {hasSearchTerm && !hasSearchResults ? (
          <p className="empty-state" role="status">
            {copy.searchNoResults}
          </p>
        ) : null}

        {matchingCategories.length > 0 ? (
          <section className="store-section" aria-labelledby="matching-categories-title">
            <h2 id="matching-categories-title">{copy.searchCategoriesTitle}</h2>
            <CategoryGrid categories={matchingCategories} locale={value} />
          </section>
        ) : null}

        {hasSearchTerm && hasSearchResults ? (
          <section className="store-section" aria-labelledby="matching-products-title">
            <h2 id="matching-products-title">{copy.searchProductsTitle}</h2>
            <ProductGrid
              products={matchingProducts}
              locale={value}
              emptyMessage={copy.searchProductsEmpty}
            />
          </section>
        ) : null}

        <Link className="text-link" href={`/${value}#categories`}>
          {copy.categoriesLabel}
        </Link>
      </section>
    </main>
  );
}
