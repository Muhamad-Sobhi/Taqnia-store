import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { categories } from "@/content/categories";
import { products } from "@/content/products";
import { getStorefrontCopy } from "@/content/storefront";
import { ProductGrid } from "@/components/features/product-grid";
import { isLocale } from "@/lib/locale";

type CategoryPageProps = Readonly<{
  params: Promise<{ locale: string; slug: string }>;
}>;

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { locale: value, slug } = await params;
  if (!isLocale(value)) {
    return {};
  }

  const category = categories.find((item) => item.slug === slug);
  return category
    ? {
        title: category.name[value],
        alternates: {
          canonical: `/${value}/categories/${slug}`,
          languages: {
            en: `/en/categories/${slug}`,
            ar: `/ar/categories/${slug}`,
          },
        },
      }
    : {};
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale: value, slug } = await params;
  if (!isLocale(value)) {
    notFound();
  }

  const category = categories.find((item) => item.slug === slug);
  if (!category) {
    notFound();
  }

  const copy = getStorefrontCopy(value);
  const categoryProducts = products.filter((product) => product.categorySlug === category.slug);

  return (
    <main id="main-content" className="page-shell">
      <nav className="breadcrumbs" aria-label={copy.navigationLabel}>
        <Link href={`/${value}`}>{copy.homeLabel}</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/${value}#categories`}>{copy.categoriesLabel}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{category.name[value]}</span>
      </nav>
      <section className="store-section" aria-labelledby="category-title">
        <h1 id="category-title">{category.name[value]}</h1>
        <h2>{copy.categoryProductsTitle}</h2>
        <ProductGrid
          products={categoryProducts}
          locale={value}
          emptyMessage={copy.categoryProductsEmpty}
        />
      </section>
    </main>
  );
}
