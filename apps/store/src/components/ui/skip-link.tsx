import type { Locale } from "@/lib/locale";
import { getStorefrontCopy } from "@/content/storefront";

export function SkipLink({ locale }: Readonly<{ locale: Locale }>) {
  return (
    <a className="skip-link" href="#main-content">
      {getStorefrontCopy(locale).skipToContent}
    </a>
  );
}
