import { getStorefrontCopy } from "@/content/storefront";
import type { StorefrontContent } from "@/content/storefront";
import type { Locale } from "@/lib/locale";
import type { StoreProduct } from "@/content/products";
import { ProductCard } from "@/components/features/product-card";

export function ProductGrid({
  products,
  locale,
  emptyMessage,
}: Readonly<{
  products: readonly StoreProduct[];
  locale: Locale;
  emptyMessage?: StorefrontContent;
}>) {
  const copy = getStorefrontCopy(locale);
  const resolvedEmptyMessage = emptyMessage ?? copy.productsEmpty;

  if (products.length === 0) {
    return (
      <p className="empty-state" role="status" data-content-status={resolvedEmptyMessage.status}>
        {resolvedEmptyMessage.text}
      </p>
    );
  }

  return (
    <ul className="product-grid">
      {products.map((product) => (
        <li key={product.slug}>
          <ProductCard product={product} locale={locale} />
        </li>
      ))}
    </ul>
  );
}
