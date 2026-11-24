import type { Locale } from "@/lib/locale";

export function formatEgp(minorUnits: number, locale: Locale): string {
  if (!Number.isSafeInteger(minorUnits) || minorUnits < 0) {
    throw new RangeError("EGP minor units must be a non-negative safe integer.");
  }

  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(minorUnits / 100);
}

export function formatEgpInput(minorUnits: number): string {
  if (!Number.isSafeInteger(minorUnits) || minorUnits < 0) {
    throw new RangeError("EGP minor units must be a non-negative safe integer.");
  }
  const value = BigInt(minorUnits);
  return `${value / 100n}.${(value % 100n).toString().padStart(2, "0")}`;
}
