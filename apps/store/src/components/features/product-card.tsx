import Image from "next/image";
import Link from "next/link";

import { getStorefrontCopy } from "@/content/storefront";
import { formatEgp } from "@/lib/currency";
import type { Locale } from "@/lib/locale";
import type { StoreProduct } from "@/content/products";

export function ProductCard({
  product,
  locale,
}: Readonly<{ product: StoreProduct; locale: Locale }>) {
  const copy = getStorefrontCopy(locale);

  return (
    <article className="product-card">
      <Link className="product-card__link" href={`/${locale}/products/${product.slug}`}>
        <div className="product-card__image">
          {product.imageUrl ? (
            <Image src={product.imageUrl} alt="" width={480} height={360} unoptimized />
          ) : (
            <span aria-hidden="true">{copy.productImagePending}</span>
          )}
        </div>
        <div className="product-card__body">
          <h3>{product.name[locale]}</h3>
          <p>{formatEgp(product.priceMinorUnits, locale)}</p>
        </div>
      </Link>
    </article>
  );
}
