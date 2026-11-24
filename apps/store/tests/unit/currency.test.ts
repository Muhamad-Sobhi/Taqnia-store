import { describe, expect, it } from "vitest";

import { formatEgp } from "@/lib/currency";

describe("formatEgp", () => {
  it("formats integer minor units as EGP for English", () => {
    expect(formatEgp(12345, "en")).toContain("EGP");
    expect(formatEgp(12345, "en")).toContain("123.45");
  });

  it("rejects negative or unsafe minor-unit values", () => {
    expect(() => formatEgp(-1, "en")).toThrow(RangeError);
    expect(() => formatEgp(Number.MAX_SAFE_INTEGER + 1, "en")).toThrow(RangeError);
  });
});
