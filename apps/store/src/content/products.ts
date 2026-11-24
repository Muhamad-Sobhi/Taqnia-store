import type { Locale } from "@/lib/locale";

export type StoreProduct = {
  slug: string;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  categorySlug: string | null;
  priceMinorUnits: number;
  imageUrl: string | null;
};

// Populate only with owner-approved catalog data; never seed fabricated inventory.
export const products: readonly StoreProduct[] = [];
