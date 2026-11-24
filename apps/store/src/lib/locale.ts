export const supportedLocales = ["en", "ar"] as const;

export type Locale = (typeof supportedLocales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return supportedLocales.some((locale) => locale === value);
}

export function getLocaleProperties(locale: Locale) {
  return {
    lang: locale,
    dir: locale === "ar" ? "rtl" : "ltr",
  } as const;
}
