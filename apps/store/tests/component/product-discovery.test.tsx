import { createElement, type ReactNode } from "react";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ProductCard } from "@/components/features/product-card";
import { ProductDetails } from "@/components/features/product-details";
import type { StoreProduct } from "@/content/products";

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) =>
    createElement("a", { href }, children),
}));

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => createElement("img", { alt, src }),
}));

const testProductFixture: StoreProduct = {
  slug: "test-router-fixture",
  name: { en: "Test router fixture", ar: "جهاز توجيه للاختبار" },
  description: { en: "Test-only description", ar: "وصف للاختبار فقط" },
  categorySlug: "routers",
  priceMinorUnits: 12345,
  imageUrl: null,
};

describe("product discovery components", () => {
  it("uses one accessible product link for the card instead of repeated links", () => {
    render(<ProductCard product={testProductFixture} locale="en" />);

    expect(screen.getAllByRole("link")).toHaveLength(1);
    const productLink = screen.getByRole("link");
    expect(productLink).toHaveAttribute("href", "/en/products/test-router-fixture");
    expect(within(productLink).getByRole("heading", { name: "Test router fixture" })).toBeVisible();
    expect(
      within(productLink).getByText("Product image will be added after catalog approval."),
    ).toHaveAttribute("aria-hidden", "true");
  });

  it("provides localized home, category, and current-product breadcrumbs", () => {
    render(<ProductDetails product={testProductFixture} locale="ar" />);

    const breadcrumbs = screen.getByRole("navigation", { name: "التنقل في المتجر" });
    expect(within(breadcrumbs).getByRole("link", { name: "الرئيسية" })).toHaveAttribute(
      "href",
      "/ar",
    );
    expect(within(breadcrumbs).getByRole("link", { name: "أجهزة التوجيه" })).toHaveAttribute(
      "href",
      "/ar/categories/routers",
    );
    expect(within(breadcrumbs).getByText("جهاز توجيه للاختبار")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
