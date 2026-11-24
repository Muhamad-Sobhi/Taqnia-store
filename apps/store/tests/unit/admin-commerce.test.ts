import { describe, expect, it } from "vitest";

import { formatEgpInput } from "@/lib/currency";
import {
  getPaymentUpdateIssue,
  isShippingTransitionAllowed,
  nextShippingStatuses,
} from "@/lib/order-workflow";
import { parseEgpMinorUnits } from "@/server/services/admin/product-validation";

describe("admin EGP input parsing", () => {
  it("parses decimal input exactly into integer minor units", () => {
    expect(parseEgpMinorUnits("0")).toBe(0);
    expect(parseEgpMinorUnits("12.3")).toBe(1230);
    expect(parseEgpMinorUnits("12.34")).toBe(1234);
    expect(parseEgpMinorUnits("42949672.95")).toBe(4_294_967_295);
    expect(formatEgpInput(1234)).toBe("12.34");
  });

  it("rejects malformed, over-precision, and out-of-range values", () => {
    expect(parseEgpMinorUnits("")).toBeNull();
    expect(parseEgpMinorUnits("01.00")).toBeNull();
    expect(parseEgpMinorUnits("1.234")).toBeNull();
    expect(parseEgpMinorUnits("42949672.96")).toBeNull();
  });
});

describe("admin shipping workflow", () => {
  it("allows only forward workflow changes or cancellation, and keeps terminal states terminal", () => {
    expect(isShippingTransitionAllowed("pending_confirmation", "shipping_details_confirmed")).toBe(
      true,
    );
    expect(isShippingTransitionAllowed("processing", "cancelled")).toBe(true);
    expect(isShippingTransitionAllowed("shipped", "processing")).toBe(false);
    expect(isShippingTransitionAllowed("delivered", "cancelled")).toBe(false);
    expect(nextShippingStatuses("delivered")).toEqual(["delivered"]);
  });
});

describe("admin manual payment verification", () => {
  it("requires transfer verification notes and restricts COD paid status until delivery", () => {
    expect(getPaymentUpdateIssue("wallet", "paid", "processing", "")).toBe(
      "transfer_verification_required",
    );
    expect(getPaymentUpdateIssue("instapay", "paid", "processing", "Verified transfer")).toBeNull();
    expect(getPaymentUpdateIssue("cod", "paid", "shipped", "")).toBe("cod_must_be_delivered");
    expect(getPaymentUpdateIssue("cod", "paid", "delivered", "")).toBeNull();
    expect(getPaymentUpdateIssue("wallet", "cash_on_delivery", "processing", "")).toBe(
      "cash_on_delivery_method_required",
    );
  });
});
