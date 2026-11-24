import type { ReactNode } from "react";

import { storeMetadata } from "@/content/metadata";
import { getLocaleProperties, defaultLocale } from "@/lib/locale";
import { SkipLink } from "@/components/ui/skip-link";
import "../globals.css";

export const metadata = storeMetadata;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const localeProperties = getLocaleProperties(defaultLocale);

  return (
    <html lang={localeProperties.lang} dir={localeProperties.dir}>
      <body>
        <SkipLink locale={defaultLocale} />
        {children}
      </body>
    </html>
  );
}
