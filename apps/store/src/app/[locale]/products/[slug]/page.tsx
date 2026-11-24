import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { products } from "@/content/products";
import { ProductDetails } from "@/components/features/product-details";
import { isLocale } from "@/lib/locale";

type ProductPageProps = Readonly<{
  params: Promise<{ locale: string; slug: string }>;
}>;

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { locale: value, slug } = await params;
  if (!isLocale(value)) {
    return {};
  }

  const product = products.find((item) => item.slug === slug);
  if (!product) {
    notFound();
  }

  return {
    title: product.name[value],
    description: product.description[value],
    alternates: {
      canonical: `/${value}/products/${slug}`,
      languages: {
        en: `/en/products/${slug}`,
        ar: `/ar/products/${slug}`,
      },
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale: value, slug } = await params;
  if (!isLocale(value)) {
    notFound();
  }

  const product = products.find((item) => item.slug === slug);
  if (!product) {
    notFound();
  }

  return (
    <main id="main-content" className="page-shell">
      <ProductDetails product={product} locale={value} />
    </main>
  );
}
