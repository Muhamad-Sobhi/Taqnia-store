import { describe, expect, it } from "vitest";

import { escapeLikePattern } from "@/lib/search";

describe("escapeLikePattern", () => {
  it("treats SQL LIKE wildcard characters as literal search text", () => {
    expect(escapeLikePattern("router%_100\\")).toBe("router\\%\\_100\\\\");
  });
});
