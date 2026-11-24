import Link from "next/link";

import { getStorefrontCopy } from "@/content/storefront";
import type { Locale } from "@/lib/locale";

export function StoreFooter({ locale }: Readonly<{ locale: Locale }>) {
  const copy = getStorefrontCopy(locale);

  return (
    <footer className="store-footer">
      <div className="store-footer__inner">
        <Link href="https://taqnia-eg.net/" rel="noopener noreferrer" target="_blank">
          {copy.aboutTaqnia}
        </Link>
        <small>{copy.copyright}</small>
      </div>
    </footer>
  );
}
