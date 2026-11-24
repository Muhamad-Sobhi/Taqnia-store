import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";

import { and, eq } from "drizzle-orm";
import { config } from "dotenv";
import type { RowDataPacket } from "mysql2";
import mysql from "mysql2/promise";
import { z } from "zod";

import { getLocalDatabaseEnvironment } from "../src/config/local-database";
import { getDatabaseEnv } from "../src/config/env";
import { getPublishedProduct, listPublishedProducts } from "../src/server/services/catalog";
import { loginCustomer, registerCustomer } from "../src/server/auth/customer";
import { findSession, revokeSession } from "../src/server/auth/session";
import {
  attributeDefinitions,
  brands,
  categories,
  orderItems,
  orderPayments,
  orders,
  productAttributeValues,
  productCategories,
  productImages,
  productVariants,
  products,
} from "../src/server/db/schema";
import {
  closeDatabaseConnection,
  getConnectionPool,
  getDatabase,
} from "../src/server/db/connection";

config({ path: ".env.local" });
config();

const migrationJournalSchema = z.object({
  entries: z.array(
    z.object({
      when: z.number().int(),
      tag: z.string(),
    }),
  ),
});

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function countRows(query: string): Promise<number> {
  const [rows] = await getConnectionPool().query<RowDataPacket[]>(query);
  const count = rows[0]?.["count"];
  if (typeof count !== "number" && typeof count !== "string") {
    throw new Error("A database compatibility count query returned no count.");
  }
  return Number(count);
}

async function runSmokeChecks() {
  getLocalDatabaseEnvironment();
  const database = getDatabase();
  const suffix = randomUUID();
  const email = `compat-${suffix}@example.invalid`;
  const phone = `+${[...suffix.replaceAll("-", "").slice(0, 15)]
    .map((character) => String(Number.parseInt(character, 16) % 10))
    .join("")}`;
  const password = "Compatibility-test-password-2026!";

  const migrationJournal = migrationJournalSchema.parse(
    JSON.parse(await readFile(new URL("../drizzle/meta/_journal.json", import.meta.url), "utf8")),
  );
  const expectedMigrationCount = migrationJournal.entries.length;
  assert(expectedMigrationCount > 0, "The Drizzle migration journal must not be empty.");
  const migrations = await countRows("SELECT COUNT(*) AS `count` FROM `__drizzle_migrations`");
  const tableCount = await countRows(
    "SELECT COUNT(*) AS `count` FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name <> '__drizzle_migrations'",
  );
  const foreignKeyCount = await countRows(
    "SELECT COUNT(*) AS `count` FROM information_schema.referential_constraints WHERE constraint_schema = DATABASE()",
  );
  const skuIndexCount = await countRows(
    "SELECT COUNT(*) AS `count` FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = 'product_variants' AND index_name = 'product_variants_sku_unique' AND non_unique = 0",
  );
  const invalidForeignKeyNameCount = await countRows(
    "SELECT COUNT(*) AS `count` FROM information_schema.referential_constraints WHERE constraint_schema = DATABASE() AND CHAR_LENGTH(constraint_name) > 64",
  );
  const nullableTimestampCount = await countRows(
    "SELECT COUNT(*) AS `count` FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'sessions' AND column_name = 'revoked_at' AND is_nullable = 'YES' AND column_default = 'NULL'",
  );
  assert(
    migrations === expectedMigrationCount,
    `Expected all ${expectedMigrationCount} Drizzle migrations to be recorded; found ${migrations}.`,
  );
  assert(tableCount === 25, "Expected the 25 application tables to be installed.");
  assert(foreignKeyCount === 31, "Expected all 31 foreign-key constraints to be installed.");
  assert(skuIndexCount === 1, "Expected the product SKU unique index to be installed.");
  assert(
    invalidForeignKeyNameCount === 0,
    "A foreign-key name exceeds MariaDB's 64-character limit.",
  );
  assert(
    nullableTimestampCount === 1,
    "The session revocation timestamp must remain nullable with a NULL default.",
  );

  const sessionToken = await registerCustomer({
    locale: "en",
    fullName: "Hosting compatibility fixture",
    email,
    phone,
    password,
  });
  const registeredSession = await findSession(sessionToken);
  assert(registeredSession?.email === email, "Registration session lookup failed.");
  assert(registeredSession.customerId, "Registration did not create a customer profile.");

  const loginToken = await loginCustomer({ locale: "en", email, password });
  assert((await findSession(loginToken))?.email === email, "Customer login query failed.");
  await revokeSession(loginToken);
  assert((await findSession(loginToken)) === null, "Revoked session remained active.");

  const [category] = await database
    .select({ id: categories.id, slug: categories.slug })
    .from(categories)
    .where(eq(categories.isActive, true))
    .limit(1);
  assert(category, "Seed at least one active category before this database smoke test.");

  const brandId = randomUUID();
  const productId = randomUUID();
  const variantId = randomUUID();
  const attributeId = randomUUID();
  const slug = `hosting-fixture-${suffix}`;
  const sku = `HOSTING-${suffix}`;

  await database.insert(brands).values({
    id: brandId,
    slug,
    name: "Hosting compatibility fixture",
  });
  await database.insert(products).values({
    id: productId,
    slug,
    nameEn: "Hosting compatibility fixture",
    nameAr: "Hosting compatibility fixture",
    descriptionEn: "Temporary database compatibility fixture.",
    descriptionAr: "Temporary database compatibility fixture.",
    brandId,
    priceMinorUnits: 12_345,
    status: "published",
  });
  await database.insert(productCategories).values({
    productId,
    categoryId: category.id,
  });
  await database.insert(productVariants).values({
    id: variantId,
    productId,
    sku,
    isDefault: true,
  });
  await database.insert(productImages).values({
    id: randomUUID(),
    productId,
    imagePath: "/taqnia-logo.png",
    altEn: "Compatibility fixture",
  });
  await database.insert(attributeDefinitions).values({
    id: attributeId,
    categoryId: category.id,
    slug: `hosting-fixture-${suffix}`,
    labelEn: "Compatibility fixture",
    labelAr: "Compatibility fixture",
    valueType: "text",
  });
  await database.insert(productAttributeValues).values({
    id: randomUUID(),
    variantId,
    attributeId,
    valueText: "fixture-only",
  });

  const catalog = await listPublishedProducts(category.slug);
  assert(
    catalog.some((product) => product.slug === slug),
    "Published catalog query failed.",
  );
  const detail = await getPublishedProduct(slug, "en");
  assert(detail?.product.priceMinorUnits === 12_345, "Product detail query failed.");
  assert(
    detail.specifications.some((specification) => specification.value === "fixture-only"),
    "Product specification query failed.",
  );

  const orderId = randomUUID();
  const orderNumber = `SIM-${suffix.slice(0, 24)}`;
  await database.insert(orders).values({
    id: orderId,
    orderNumber,
    customerId: registeredSession.customerId,
    subtotalMinorUnits: 12_345,
    totalMinorUnits: 12_345,
    customerName: "Hosting compatibility fixture",
    customerEmail: email,
    customerPhone: "+999000000001",
    governorate: "Simulation",
    cityArea: "Simulation",
    streetAddress: "Temporary test fixture",
  });
  await database.insert(orderItems).values({
    id: randomUUID(),
    orderId,
    productId,
    variantId,
    productNameEn: "Hosting compatibility fixture",
    productNameAr: "Hosting compatibility fixture",
    sku,
    quantity: 1,
    unitPriceMinorUnits: 12_345,
    lineTotalMinorUnits: 12_345,
  });
  await database.insert(orderPayments).values({
    id: randomUUID(),
    orderId,
    method: "wallet",
    amountMinorUnits: 12_345,
  });

  const orderRows = await database
    .select({
      orderNumber: orders.orderNumber,
      paymentStatus: orderPayments.status,
    })
    .from(orders)
    .leftJoin(orderPayments, eq(orderPayments.orderId, orders.id))
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);
  assert(orderRows[0]?.orderNumber === orderNumber, "Order management query failed.");

  await database.transaction(async (transaction) => {
    const [order] = await transaction
      .select({ id: orders.id, shippingStatus: orders.shippingStatus })
      .from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.orderNumber, orderNumber)))
      .limit(1)
      .for("update");
    assert(order, "The order row lock query returned no order.");
    await transaction
      .update(orders)
      .set({ shippingStatus: "processing" })
      .where(eq(orders.id, order.id));
  });

  const [updatedOrder] = await database
    .select({ shippingStatus: orders.shippingStatus })
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);
  assert(updatedOrder?.shippingStatus === "processing", "Order transaction did not commit.");

  const pooledConnection = await getConnectionPool().getConnection();
  let connectionId: number;
  try {
    const [rows] = await pooledConnection.query<RowDataPacket[]>(
      "SELECT CONNECTION_ID() AS `connection_id`",
    );
    const value = rows[0]?.["connection_id"];
    connectionId = Number(value);
    assert(Number.isSafeInteger(connectionId) && connectionId > 0, "Invalid pooled connection id.");
  } finally {
    pooledConnection.release();
  }

  const databaseEnvironment = getDatabaseEnv();
  const killer = await mysql.createConnection({
    host: databaseEnvironment.DATABASE_HOST,
    port: databaseEnvironment.DATABASE_PORT,
    database: databaseEnvironment.DATABASE_NAME,
    user: databaseEnvironment.DATABASE_USER,
    password: databaseEnvironment.DATABASE_PASSWORD,
  });
  try {
    await killer.query(`KILL CONNECTION ${connectionId}`);
  } finally {
    await killer.end();
  }
  await new Promise((resolve) => setTimeout(resolve, 100));

  let disconnectedQueryRejected = false;
  try {
    await getConnectionPool().query("SELECT 1");
  } catch {
    disconnectedQueryRejected = true;
  }
  const [reconnectedRows] = await getConnectionPool().query<RowDataPacket[]>("SELECT 1 AS `ok`");
  assert(Number(reconnectedRows[0]?.["ok"]) === 1, "The database pool did not reconnect.");

  console.info(
    `Database compatibility smoke checks passed: migration journal ${migrations}/${expectedMigrationCount} (no pending migrations), constraints, auth/session, catalog/detail, order query, transaction, row lock, and disconnected-connection recovery (${disconnectedQueryRejected ? "query error surfaced" : "stale connection was replaced"}).`,
  );
}

runSmokeChecks()
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Unknown runtime error.";
    const password = process.env.DATABASE_PASSWORD;
    console.error(
      `Database compatibility smoke checks failed: ${password ? message.replaceAll(password, "[redacted]") : message}`,
    );
    process.exitCode = 1;
  })
  .finally(closeDatabaseConnection);
