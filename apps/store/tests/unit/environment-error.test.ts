import { describe, expect, it } from "vitest";
import { ZodError } from "zod";

import { getInvalidEnvironmentVariables } from "@/config/environment-error";

describe("getInvalidEnvironmentVariables", () => {
  it("returns unique variable names without exposing invalid values", () => {
    const error = new ZodError([
      {
        code: "invalid_type",
        expected: "string",
        path: ["SESSION_SECRET"],
        message: "Invalid input",
      },
      {
        code: "invalid_type",
        expected: "string",
        path: ["SESSION_SECRET"],
        message: "Invalid input",
      },
      {
        code: "invalid_type",
        expected: "string",
        path: ["DATABASE_PASSWORD"],
        message: "Invalid input",
      },
    ]);

    expect(getInvalidEnvironmentVariables(error)).toEqual(["SESSION_SECRET", "DATABASE_PASSWORD"]);
  });

  it("does not classify unrelated errors as environment configuration failures", () => {
    expect(getInvalidEnvironmentVariables(new Error("Database unavailable"))).toBeNull();
  });
});
