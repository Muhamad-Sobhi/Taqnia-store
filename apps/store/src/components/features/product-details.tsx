import Image from "next/image";
import Link from "next/link";

import { categories } from "@/content/categories";
import { getStorefrontCopy } from "@/content/storefront";
import type { StoreProduct } from "@/content/products";
import { formatEgp } from "@/lib/currency";
import type { Locale } from "@/lib/locale";

export function ProductDetails({
  product,
  locale,
}: Readonly<{ product: StoreProduct; locale: Locale }>) {
  const copy = getStorefrontCopy(locale);
  const category = categories.find((item) => item.slug === product.categorySlug);

  return (
    <>
      <nav className="breadcrumbs" aria-label={copy.navigationLabel}>
        <Link href={`/${locale}`}>{copy.homeLabel}</Link>
        <span aria-hidden="true">/</span>
        {category ? (
          <>
            <Link href={`/${locale}/categories/${category.slug}`}>{category.name[locale]}</Link>
            <span aria-hidden="true">/</span>
          </>
        ) : null}
        <span aria-current="page">{product.name[locale]}</span>
      </nav>
      <article className="product-detail">
        <div className="product-detail__image">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name[locale]}
              width={720}
              height={540}
              unoptimized
            />
          ) : (
            <span>{copy.productImagePending}</span>
          )}
        </div>
        <div className="product-detail__content">
          <h1>{product.name[locale]}</h1>
          <p>{product.description[locale]}</p>
          <p className="product-detail__price">
            <span>{copy.productPriceLabel}:</span> {formatEgp(product.priceMinorUnits, locale)}
          </p>
        </div>
      </article>
    </>
  );
}
