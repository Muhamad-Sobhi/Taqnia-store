import { redirect } from "next/navigation";

import { categories } from "@/content/categories";
import { defaultLocale } from "@/lib/locale";

const skuPattern = /^[A-Za-z0-9._-]{1,120}$/;

type QuoteRedirectProps = Readonly<{
  searchParams: Promise<{
    sku?: string | string[];
    category?: string | string[];
  }>;
}>;

export default async function QuoteRedirect({ searchParams }: QuoteRedirectProps) {
  const query = await searchParams;
  const params = new URLSearchParams();

  if (typeof query.sku === "string" && skuPattern.test(query.sku)) {
    params.set("sku", query.sku);
  }

  if (
    typeof query.category === "string" &&
    categories.some((category) => category.slug === query.category)
  ) {
    params.set("category", query.category);
  }

  const search = params.toString();
  redirect(`/${defaultLocale}/quote${search ? `?${search}` : ""}`);
}
