import Link from "next/link";

import type { StoreCategory } from "@/content/categories";
import type { Locale } from "@/lib/locale";

export function CategoryGrid({
  categories,
  locale,
}: Readonly<{
  categories: readonly StoreCategory[];
  locale: Locale;
}>) {
  return (
    <ul className="category-grid">
      {categories.map((category) => (
        <li key={category.slug}>
          <Link className="category-card" href={`/${locale}/categories/${category.slug}`}>
            <span>{category.name[locale]}</span>
            <span className="category-card__arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
