"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { getStorefrontCopy } from "@/content/storefront";
import type { Locale } from "@/lib/locale";

function SearchForm({ locale, query }: Readonly<{ locale: Locale; query: string }>) {
  const copy = getStorefrontCopy(locale);

  return (
    <form className="store-search" action={`/${locale}/search`} method="get" role="search">
      <label className="visually-hidden" htmlFor={`store-search-${locale}`}>
        {copy.searchLabel}
      </label>
      <input
        key={query}
        id={`store-search-${locale}`}
        type="search"
        name="q"
        placeholder={copy.searchPlaceholder}
        defaultValue={query}
        enterKeyHint="search"
      />
      <button className="button button--primary" type="submit">
        {copy.searchAction}
      </button>
    </form>
  );
}

function SearchFormWithQuery({ locale }: Readonly<{ locale: Locale }>) {
  const queryValues = useSearchParams().getAll("q");
  const query = queryValues.length === 1 ? (queryValues[0] ?? "") : "";

  return <SearchForm locale={locale} query={query} />;
}

export function StoreSearch({ locale }: Readonly<{ locale: Locale }>) {
  return (
    <Suspense fallback={<SearchForm locale={locale} query="" />}>
      <SearchFormWithQuery locale={locale} />
    </Suspense>
  );
}
