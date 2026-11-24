import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getStorefrontCopy } from "@/content/storefront";
import { StoreFooter } from "@/components/layout/store-footer";
import { StoreHeader } from "@/components/layout/store-header";
import { SkipLink } from "@/components/ui/skip-link";
import { getLocaleProperties, isLocale, supportedLocales } from "@/lib/locale";
import "../globals.css";

type LocaleParams = Readonly<{
  params: Promise<{ locale: string }>;
}>;

type LocaleLayoutProps = LocaleParams &
  Readonly<{
    children: ReactNode;
  }>;

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale: value } = await params;
  if (!isLocale(value)) {
    return {};
  }

  const copy = getStorefrontCopy(value);
  return {
    title: { default: copy.storeName, template: `%s | ${copy.storeName}` },
    description: copy.heroDescription.text,
    metadataBase: new URL("https://store.taqnia-eg.net"),
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: value } = await params;
  if (!isLocale(value)) {
    redirect("/en");
  }

  const localeProperties = getLocaleProperties(value);

  return (
    <html lang={localeProperties.lang} dir={localeProperties.dir} suppressHydrationWarning>
      <body>
        <SkipLink locale={value} />
        <StoreHeader locale={value} />
        {children}
        <StoreFooter locale={value} />
      </body>
    </html>
  );
}
