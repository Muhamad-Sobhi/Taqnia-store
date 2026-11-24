import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("the English storefront exposes category discovery and one catalog empty state", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/en$/);
  await expect(
    page.getByRole("heading", { name: "Discover IT and networking equipment" }),
  ).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("link", { name: "Taqnia Store" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Skip to main content" })).toHaveAttribute(
    "href",
    "#main-content",
  );
  await expect(page.getByRole("search")).toBeVisible();
  await expect(page.getByRole("link", { name: "Routers" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Catalog coming soon" })).toBeVisible();
  await expect(page.getByText("No products are available to browse right now.")).toBeVisible();
  await expect(page.locator(".store-hero__description")).toHaveAttribute(
    "data-content-status",
    "placeholder",
  );
  await expect(page.locator(".catalog-empty-state")).toHaveCount(1);
  await expect(page.locator("#catalog-empty-title")).toHaveAttribute(
    "data-content-status",
    "placeholder",
  );
  await expect(page.locator(".catalog-empty-state")).toHaveAttribute(
    "aria-describedby",
    "catalog-empty-description",
  );
  await expect(page.getByRole("link", { name: "Offers" })).toHaveCount(0);
  for (const section of [
    "Featured products",
    "Best sellers",
    "New arrivals",
    "Special offers",
    "Featured brands",
  ]) {
    await expect(page.getByRole("heading", { name: section })).toHaveCount(0);
  }
  await expect(
    page.getByText("Product listings will be published after catalog details are confirmed."),
  ).toHaveCount(0);
});

test("the locale switcher navigates to an Arabic RTL storefront", async ({ page }) => {
  await page.goto("/en");
  await page.getByRole("link", { name: "العربية" }).click();

  await expect(page).toHaveURL(/\/ar$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("link", { name: "متجر تقنية" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "اكتشف معدات تقنية المعلومات والشبكات" }),
  ).toBeVisible();
  await expect(page.locator(".store-hero__description")).toHaveAttribute(
    "data-content-status",
    "placeholder",
  );
  await expect(page.getByRole("link", { name: "أجهزة التوجيه" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "الكتالوج قريبًا" })).toBeVisible();
  await expect(page.getByText("لا تتوفر منتجات للتصفح حاليًا.")).toBeVisible();
  await expect(page.locator(".catalog-empty-state")).toHaveCount(1);
  await expect(page.locator("#catalog-empty-title")).toHaveAttribute(
    "data-content-status",
    "placeholder",
  );
  await expect(page.getByRole("link", { name: "العروض" })).toHaveCount(0);
  for (const section of [
    "منتجات مميزة",
    "الأكثر مبيعًا",
    "وصل حديثًا",
    "عروض خاصة",
    "علامات تجارية مميزة",
  ]) {
    await expect(page.getByRole("heading", { name: section })).toHaveCount(0);
  }
});

test("product and order administration pages require an authenticated admin session", async ({
  page,
}) => {
  for (const route of ["/en/admin", "/en/admin/products", "/en/admin/orders"]) {
    await page.goto(route);
    await expect(page).toHaveURL("/en/account/login");
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  }
});

test("the header fits the minimum supported width in English and Arabic", async ({ page }) => {
  for (const locale of ["en", "ar"] as const) {
    await page.setViewportSize({ width: 320, height: 812 });
    await page.goto(`/${locale}`);

    const widths = await page.evaluate(() => ({
      document: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
    }));
    expect(widths.document, `${locale} header at 320px`).toBe(widths.viewport);
  }
});

test("search keeps its query visible and preserves it when switching locale", async ({ page }) => {
  await page.goto("/en");
  const search = page.getByRole("searchbox", { name: "Search products" });

  await search.fill("routers");
  await search.press("Enter");
  await expect(page).toHaveURL("/en/search?q=routers");
  await expect(page.getByRole("searchbox", { name: "Search products" })).toHaveValue("routers");

  await page.getByRole("link", { name: "العربية" }).click();
  await expect(page).toHaveURL("/ar/search?q=routers");
  await expect(page.getByRole("searchbox", { name: "ابحث عن المنتجات" })).toHaveValue("routers");
});

test("the home page has no serious or critical WCAG 2.2 AA violations", async ({ page }) => {
  test.setTimeout(90_000);

  for (const locale of ["en", "ar"] as const) {
    for (const width of [360, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}`);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      const seriousViolations = results.violations.filter(
        ({ impact }) => impact === "serious" || impact === "critical",
      );

      expect(
        seriousViolations,
        `${locale} home at ${width}px: ${JSON.stringify(seriousViolations, null, 2)}`,
      ).toEqual([]);
    }
  }
});

test("search finds matching categories without inventing product listings", async ({ page }) => {
  await page.goto("/en/search?q=routers");

  await expect(page.getByRole("heading", { name: "Matching categories" })).toBeVisible();
  await expect(page.locator(".category-grid").getByRole("link", { name: "Routers" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Matching products" })).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("No products matched your search.");
  await expect(page.getByRole("status")).toHaveAttribute("data-content-status", "placeholder");
});

test("search shows one contextual empty state without results or a query", async ({ page }) => {
  await page.goto("/ar/search?q=unmatched-query");

  await expect(page.getByRole("status")).toHaveText(
    "لم يتم العثور على منتجات أو فئات مطابقة لبحثك.",
  );
  await expect(page.getByRole("heading", { name: "الفئات المطابقة" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "المنتجات المطابقة" })).toHaveCount(0);

  await page.goto("/ar/search");
  await expect(page.getByText("أدخل اسم منتج أو فئة لبدء البحث.")).toBeVisible();
  await expect(page.getByRole("status")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "الفئات المطابقة" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "المنتجات المطابقة" })).toHaveCount(0);
});

test("category pages show an honest empty catalog until products are supplied", async ({
  page,
}) => {
  await page.goto("/ar/categories/routers");

  await expect(page.getByRole("heading", { name: "أجهزة التوجيه" })).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("لا توجد منتجات معروضة في هذه الفئة حاليًا.");
  await expect(page.getByRole("status")).toHaveAttribute("data-content-status", "placeholder");
  const breadcrumbs = page.locator(".breadcrumbs");
  await expect(breadcrumbs.getByRole("link", { name: "الرئيسية" })).toHaveAttribute("href", "/ar");
  await expect(breadcrumbs.getByRole("link", { name: "الفئات" })).toHaveAttribute(
    "href",
    "/ar#categories",
  );
  await expect(breadcrumbs.getByText("أجهزة التوجيه")).toHaveAttribute("aria-current", "page");
});

test("category grid fits responsive widths without horizontal overflow", async ({ page }) => {
  for (const locale of ["en", "ar"] as const) {
    for (const width of [320, 360, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}`);

      const grid = page.locator(".category-grid");
      await expect(grid.getByRole("link")).toHaveCount(11);
      const gridColumns = await grid.evaluate(
        (element) => getComputedStyle(element).gridTemplateColumns.split(/\s+/).length,
      );
      const measurements = await page.evaluate(() => ({
        document: document.documentElement.scrollWidth,
        viewport: window.innerWidth,
      }));

      expect(measurements.document, `${locale} categories at ${width}px`).toBe(
        measurements.viewport,
      );
      expect(gridColumns).toBe(width >= 1200 ? 4 : width >= 768 ? 3 : width >= 512 ? 2 : 1);
    }
  }
});

test("unpublished product URLs return the localized not-found page", async ({ page }) => {
  const response = await page.goto("/en/products/not-published");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /Page not found/ })).toBeVisible();
});

test("quote page is localized, unavailable, and not indexable", async ({ page }, testInfo) => {
  for (const locale of ["en", "ar"] as const) {
    await page.goto(`/${locale}/quote`);

    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.locator("html")).toHaveAttribute("dir", locale === "ar" ? "rtl" : "ltr");
    await expect(
      page.getByRole("heading", { name: locale === "en" ? "Request a quote" : "طلب عرض سعر" }),
    ).toBeVisible();
    await expect(page.getByRole("status")).toHaveText(
      locale === "en"
        ? "Quote requests are temporarily unavailable."
        : "طلبات عروض الأسعار غير متاحة مؤقتًا.",
    );
    await expect(page.getByRole("status")).toHaveAttribute("data-content-status", "placeholder");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      new RegExp(`/${locale}/quote$`),
    );
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      "href",
      /\/en\/quote$/,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="ar"]')).toHaveAttribute(
      "href",
      /\/ar\/quote$/,
    );
    await expect(page.locator("main form")).toHaveCount(0);
    await expect(page.locator('main a[href*="/quote"]')).toHaveCount(0);

    if (locale === "ar") {
      await testInfo.attach("quote-ar-rtl", {
        body: await page.screenshot({ fullPage: true }),
        contentType: "image/png",
      });
    }
  }
});

test("bare quote route redirects to the default locale with only valid prefill parameters", async ({
  page,
}) => {
  await page.goto("/quote");
  await expect(page).toHaveURL(/\/en\/quote$/);

  await page.goto("/quote?sku=TEST-ROUTER_1&category=routers&campaign=ignored");
  await expect(page).toHaveURL(/\/en\/quote\?sku=TEST-ROUTER_1&category=routers$/);

  const maxLengthSku = "S".repeat(120);
  await page.goto(`/quote?sku=${maxLengthSku}`);
  await expect(page).toHaveURL(new RegExp(`/en/quote\\?sku=${maxLengthSku}$`));

  await page.goto(`/quote?sku=${"S".repeat(121)}`);
  await expect(page).toHaveURL(/\/en\/quote$/);

  await page.goto("/quote?sku=invalid%2Fsku&category=unknown");
  await expect(page).toHaveURL(/\/en\/quote$/);
});

test("customer account pages require sign-in and expose registration fields", async ({ page }) => {
  await page.goto("/ar/account");
  await expect(page).toHaveURL(/\/ar\/account\/login$/);
  await expect(page.getByRole("heading", { name: "تسجيل الدخول" })).toBeVisible();
  await expect(page.getByLabel("البريد الإلكتروني")).toBeVisible();
  await expect(page.getByLabel("كلمة المرور")).toBeVisible();

  await page.goto("/ar/account/register");
  await expect(page.getByLabel("الاسم الكامل")).toBeVisible();
  await expect(page.getByLabel("البريد الإلكتروني")).toBeVisible();
  await expect(page.getByLabel("رقم الهاتف")).toBeVisible();
  await expect(page.getByLabel("كلمة المرور")).toHaveAttribute("minlength", "12");
});

test("mobile navigation remains keyboard-operable", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/en");

  const menu = page.locator(".mobile-navigation");
  await expect(menu).toBeVisible();
  const summary = menu.locator("summary");
  await summary.focus();
  await summary.press("Space");
  await expect(menu).toHaveAttribute("open", "");
  await expect(menu.getByRole("link", { name: "Categories" })).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(menu.getByRole("link", { name: "Home" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(menu.getByRole("link", { name: "Categories" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/en#categories$/);
});
