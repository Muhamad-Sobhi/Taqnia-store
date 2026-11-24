import { describe, expect, it } from "vitest";

import { getLocaleProperties } from "@/lib/locale";

describe("getLocaleProperties", () => {
  it("uses a right-to-left document for Arabic", () => {
    expect(getLocaleProperties("ar")).toEqual({ lang: "ar", dir: "rtl" });
  });

  it("uses a left-to-right document for English", () => {
    expect(getLocaleProperties("en")).toEqual({ lang: "en", dir: "ltr" });
  });
});
