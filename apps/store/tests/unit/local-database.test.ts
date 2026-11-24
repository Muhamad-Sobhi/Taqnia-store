import { describe, expect, it } from "vitest";

import {
  getLocalDatabaseEnvironment,
  LocalDatabaseConfigurationError,
} from "@/config/local-database";

const validEnvironment = {
  NODE_ENV: "development",
  DATABASE_HOST: "localhost",
  DATABASE_PORT: "3306",
  DATABASE_NAME: "taqnia_store_local",
  DATABASE_USER: "store_local",
  DATABASE_PASSWORD: "local-only",
};

describe("local database safety", () => {
  it("accepts loopback development and test databases with scoped names", () => {
    expect(getLocalDatabaseEnvironment(validEnvironment).DATABASE_PORT).toBe(3306);
    expect(
      getLocalDatabaseEnvironment({
        ...validEnvironment,
        NODE_ENV: "test",
        DATABASE_NAME: "taqnia_store_test",
      }).DATABASE_NAME,
    ).toBe("taqnia_store_test");
  });

  it("rejects remote hosts, production mode, and unscoped database names", () => {
    expect(() =>
      getLocalDatabaseEnvironment({ ...validEnvironment, DATABASE_HOST: "db.example.invalid" }),
    ).toThrow(LocalDatabaseConfigurationError);
    expect(() =>
      getLocalDatabaseEnvironment({ ...validEnvironment, NODE_ENV: "production" }),
    ).toThrow(LocalDatabaseConfigurationError);
    expect(() =>
      getLocalDatabaseEnvironment({ ...validEnvironment, DATABASE_NAME: "taqnia_store" }),
    ).toThrow(LocalDatabaseConfigurationError);
  });
});
