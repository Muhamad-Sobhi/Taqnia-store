import { describe, expect, it } from "vitest";

import { hashPassword, InvalidPasswordHashError, verifyPassword } from "@/server/auth/password";

describe("password hashing", () => {
  it("verifies the supplied password without storing it in the encoded hash", async () => {
    const password = "Correct-Horse-Battery-Staple";
    const encodedHash = await hashPassword(password);

    expect(encodedHash).not.toContain(password);
    await expect(verifyPassword(password, encodedHash)).resolves.toBe(true);
    await expect(verifyPassword("incorrect-password", encodedHash)).resolves.toBe(false);
  });

  it("rejects malformed or unsupported stored hashes", async () => {
    await expect(verifyPassword("any-password", "plain-text")).rejects.toBeInstanceOf(
      InvalidPasswordHashError,
    );
  });
});
