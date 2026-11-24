import { describe, expect, it } from "vitest";

import { registerCustomerSchema } from "@/server/auth/validation";

describe("registerCustomerSchema", () => {
  it("normalizes email and phone while preserving the provided customer details", () => {
    const result = registerCustomerSchema.parse({
      locale: "en",
      fullName: "  Customer Example  ",
      email: "  CUSTOMER@example.com ",
      phone: "010 1234-5678",
      password: "A-longer-test-password",
    });

    expect(result).toMatchObject({
      fullName: "Customer Example",
      email: "customer@example.com",
      phone: "01012345678",
    });
  });

  it("rejects weak passwords and invalid phone numbers", () => {
    const result = registerCustomerSchema.safeParse({
      locale: "en",
      fullName: "Customer Example",
      email: "customer@example.com",
      phone: "not-a-phone",
      password: "short",
    });

    expect(result.success).toBe(false);
  });
});
