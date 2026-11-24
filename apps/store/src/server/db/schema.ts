import { sql } from "drizzle-orm";
import {
  boolean,
  decimal,
  foreignKey,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

const createdAt = () =>
  timestamp("created_at", { mode: "date" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`);
const updatedAt = () =>
  timestamp("updated_at", { mode: "date" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .onUpdateNow();

export const users = mysqlTable(
  "users",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    email: varchar("email", { length: 254 }).notNull(),
    phone: varchar("phone", { length: 32 }).notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    status: mysqlEnum("status", ["active", "disabled"]).notNull().default("active"),
    emailVerifiedAt: timestamp("email_verified_at", { mode: "date" }).default(sql`NULL`),
    phoneVerifiedAt: timestamp("phone_verified_at", { mode: "date" }).default(sql`NULL`),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    uniqueIndex("users_email_unique").on(table.email),
    uniqueIndex("users_phone_unique").on(table.phone),
    index("users_status_index").on(table.status),
  ],
);

export const customerProfiles = mysqlTable(
  "customer_profiles",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    fullName: varchar("full_name", { length: 160 }).notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [uniqueIndex("customer_profiles_user_id_unique").on(table.userId)],
);

export const roles = mysqlTable(
  "roles",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    slug: varchar("slug", { length: 64 }).notNull(),
    label: varchar("label", { length: 120 }).notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [uniqueIndex("roles_slug_unique").on(table.slug)],
);

export const permissions = mysqlTable(
  "permissions",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    slug: varchar("slug", { length: 100 }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [uniqueIndex("permissions_slug_unique").on(table.slug)],
);

export const userRoles = mysqlTable(
  "user_roles",
  {
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roleId: varchar("role_id", { length: 36 })
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    createdAt: createdAt(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.roleId] }),
    index("user_roles_role_id_index").on(table.roleId),
  ],
);

export const rolePermissions = mysqlTable(
  "role_permissions",
  {
    roleId: varchar("role_id", { length: 36 })
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    permissionId: varchar("permission_id", { length: 36 })
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
    createdAt: createdAt(),
  },
  (table) => [
    primaryKey({ columns: [table.roleId, table.permissionId] }),
    index("role_permissions_permission_id_index").on(table.permissionId),
  ],
);

export const sessions = mysqlTable(
  "sessions",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: varchar("token_hash", { length: 64 }).notNull(),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
    lastSeenAt: timestamp("last_seen_at", { mode: "date" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    revokedAt: timestamp("revoked_at", { mode: "date" }).default(sql`NULL`),
    createdAt: createdAt(),
  },
  (table) => [
    uniqueIndex("sessions_token_hash_unique").on(table.tokenHash),
    index("sessions_user_expiry_index").on(table.userId, table.expiresAt),
  ],
);

export const passwordResetTokens = mysqlTable(
  "password_reset_tokens",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: varchar("token_hash", { length: 64 }).notNull(),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
    usedAt: timestamp("used_at", { mode: "date" }).default(sql`NULL`),
    createdAt: createdAt(),
  },
  (table) => [
    uniqueIndex("password_reset_tokens_hash_unique").on(table.tokenHash),
    index("password_reset_tokens_user_expiry_index").on(table.userId, table.expiresAt),
  ],
);

export const addresses = mysqlTable(
  "addresses",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    customerId: varchar("customer_id", { length: 36 })
      .notNull()
      .references(() => customerProfiles.id, { onDelete: "cascade" }),
    label: varchar("label", { length: 80 }),
    governorate: varchar("governorate", { length: 120 }).notNull(),
    cityArea: varchar("city_area", { length: 160 }).notNull(),
    streetAddress: varchar("street_address", { length: 255 }).notNull(),
    building: varchar("building", { length: 80 }),
    apartment: varchar("apartment", { length: 80 }),
    postalCode: varchar("postal_code", { length: 32 }),
    deliveryNotes: text("delivery_notes"),
    isDefault: boolean("is_default").notNull().default(false),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [index("addresses_customer_index").on(table.customerId)],
);

export const categories = mysqlTable(
  "categories",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    slug: varchar("slug", { length: 160 }).notNull(),
    nameEn: varchar("name_en", { length: 160 }).notNull(),
    nameAr: varchar("name_ar", { length: 160 }).notNull(),
    descriptionEn: text("description_en"),
    descriptionAr: text("description_ar"),
    sortOrder: int("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    uniqueIndex("categories_slug_unique").on(table.slug),
    index("categories_active_order_index").on(table.isActive, table.sortOrder),
  ],
);

export const brands = mysqlTable(
  "brands",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    slug: varchar("slug", { length: 160 }).notNull(),
    name: varchar("name", { length: 160 }).notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [uniqueIndex("brands_slug_unique").on(table.slug)],
);

export const products = mysqlTable(
  "products",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    slug: varchar("slug", { length: 180 }).notNull(),
    nameEn: varchar("name_en", { length: 255 }).notNull(),
    nameAr: varchar("name_ar", { length: 255 }).notNull(),
    descriptionEn: text("description_en"),
    descriptionAr: text("description_ar"),
    brandId: varchar("brand_id", { length: 36 }).references(() => brands.id, {
      onDelete: "set null",
    }),
    priceMinorUnits: int("price_minor_units", { unsigned: true }),
    currencyCode: varchar("currency_code", { length: 3 }).notNull().default("EGP"),
    status: mysqlEnum("status", ["draft", "published", "archived"]).notNull().default("draft"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    uniqueIndex("products_slug_unique").on(table.slug),
    index("products_brand_index").on(table.brandId),
    index("products_status_index").on(table.status),
  ],
);

export const productCategories = mysqlTable(
  "product_categories",
  {
    productId: varchar("product_id", { length: 36 })
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    categoryId: varchar("category_id", { length: 36 })
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.productId, table.categoryId] }),
    index("product_categories_category_index").on(table.categoryId),
  ],
);

export const productVariants = mysqlTable(
  "product_variants",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    productId: varchar("product_id", { length: 36 })
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    sku: varchar("sku", { length: 120 }).notNull(),
    nameEn: varchar("name_en", { length: 255 }),
    nameAr: varchar("name_ar", { length: 255 }),
    isDefault: boolean("is_default").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    uniqueIndex("product_variants_sku_unique").on(table.sku),
    index("product_variants_product_index").on(table.productId),
  ],
);

export const productImages = mysqlTable(
  "product_images",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    productId: varchar("product_id", { length: 36 })
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    imagePath: varchar("image_path", { length: 512 }).notNull(),
    altEn: varchar("alt_en", { length: 255 }),
    altAr: varchar("alt_ar", { length: 255 }),
    sortOrder: int("sort_order").notNull().default(0),
    createdAt: createdAt(),
  },
  (table) => [index("product_images_product_order_index").on(table.productId, table.sortOrder)],
);

export const attributeDefinitions = mysqlTable(
  "attribute_definitions",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    categoryId: varchar("category_id", { length: 36 })
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    slug: varchar("slug", { length: 120 }).notNull(),
    labelEn: varchar("label_en", { length: 160 }).notNull(),
    labelAr: varchar("label_ar", { length: 160 }).notNull(),
    valueType: mysqlEnum("value_type", ["text", "number", "boolean", "select"]).notNull(),
    unit: varchar("unit", { length: 40 }),
    options: json("options").$type<string[]>(),
    isFilterable: boolean("is_filterable").notNull().default(false),
    sortOrder: int("sort_order").notNull().default(0),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    uniqueIndex("attribute_definitions_category_slug_unique").on(table.categoryId, table.slug),
    index("attribute_definitions_category_order_index").on(table.categoryId, table.sortOrder),
  ],
);

export const productAttributeValues = mysqlTable(
  "product_attribute_values",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    variantId: varchar("variant_id", { length: 36 })
      .notNull()
      .references(() => productVariants.id, { onDelete: "cascade" }),
    attributeId: varchar("attribute_id", { length: 36 }).notNull(),
    valueText: varchar("value_text", { length: 1000 }),
    valueNumber: decimal("value_number", { precision: 20, scale: 6 }),
    valueBoolean: boolean("value_boolean"),
    valueJson: json("value_json"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    foreignKey({
      name: "pav_attribute_def_fk",
      columns: [table.attributeId],
      foreignColumns: [attributeDefinitions.id],
    }).onDelete("cascade"),
    uniqueIndex("product_attribute_values_variant_attribute_unique").on(
      table.variantId,
      table.attributeId,
    ),
    index("product_attribute_values_attribute_index").on(table.attributeId),
  ],
);

export const inventory = mysqlTable(
  "inventory",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    variantId: varchar("variant_id", { length: 36 })
      .notNull()
      .references(() => productVariants.id, { onDelete: "cascade" }),
    quantityOnHand: int("quantity_on_hand", { unsigned: true }).notNull().default(0),
    quantityReserved: int("quantity_reserved", { unsigned: true }).notNull().default(0),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [uniqueIndex("inventory_variant_unique").on(table.variantId)],
);

export const inventoryMovements = mysqlTable(
  "inventory_movements",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    variantId: varchar("variant_id", { length: 36 })
      .notNull()
      .references(() => productVariants.id, { onDelete: "restrict" }),
    quantityDelta: int("quantity_delta").notNull(),
    reason: varchar("reason", { length: 120 }).notNull(),
    note: text("note"),
    createdByUserId: varchar("created_by_user_id", { length: 36 }).references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: createdAt(),
  },
  (table) => [
    index("inventory_movements_variant_created_index").on(table.variantId, table.createdAt),
  ],
);

export const orders = mysqlTable(
  "orders",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    orderNumber: varchar("order_number", { length: 32 }).notNull(),
    customerId: varchar("customer_id", { length: 36 })
      .notNull()
      .references(() => customerProfiles.id, { onDelete: "restrict" }),
    shippingStatus: mysqlEnum("shipping_status", [
      "pending_confirmation",
      "shipping_details_confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ])
      .notNull()
      .default("pending_confirmation"),
    currencyCode: varchar("currency_code", { length: 3 }).notNull().default("EGP"),
    subtotalMinorUnits: int("subtotal_minor_units", { unsigned: true }).notNull(),
    shippingFeeMinorUnits: int("shipping_fee_minor_units", { unsigned: true }).notNull().default(0),
    totalMinorUnits: int("total_minor_units", { unsigned: true }).notNull(),
    customerName: varchar("customer_name", { length: 160 }).notNull(),
    customerEmail: varchar("customer_email", { length: 254 }).notNull(),
    customerPhone: varchar("customer_phone", { length: 32 }).notNull(),
    governorate: varchar("governorate", { length: 120 }).notNull(),
    cityArea: varchar("city_area", { length: 160 }).notNull(),
    streetAddress: varchar("street_address", { length: 255 }).notNull(),
    building: varchar("building", { length: 80 }),
    apartment: varchar("apartment", { length: 80 }),
    postalCode: varchar("postal_code", { length: 32 }),
    deliveryNotes: text("delivery_notes"),
    shippingMethod: varchar("shipping_method", { length: 120 }),
    estimatedDelivery: varchar("estimated_delivery", { length: 160 }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    uniqueIndex("orders_number_unique").on(table.orderNumber),
    index("orders_customer_created_index").on(table.customerId, table.createdAt),
    index("orders_shipping_status_created_index").on(table.shippingStatus, table.createdAt),
  ],
);

export const orderItems = mysqlTable(
  "order_items",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    orderId: varchar("order_id", { length: 36 })
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: varchar("product_id", { length: 36 }).references(() => products.id, {
      onDelete: "set null",
    }),
    variantId: varchar("variant_id", { length: 36 }).references(() => productVariants.id, {
      onDelete: "set null",
    }),
    productNameEn: varchar("product_name_en", { length: 255 }).notNull(),
    productNameAr: varchar("product_name_ar", { length: 255 }).notNull(),
    sku: varchar("sku", { length: 120 }).notNull(),
    quantity: int("quantity", { unsigned: true }).notNull(),
    unitPriceMinorUnits: int("unit_price_minor_units", { unsigned: true }).notNull(),
    lineTotalMinorUnits: int("line_total_minor_units", { unsigned: true }).notNull(),
    createdAt: createdAt(),
  },
  (table) => [
    index("order_items_order_index").on(table.orderId),
    index("order_items_product_index").on(table.productId),
    index("order_items_variant_index").on(table.variantId),
  ],
);

export const orderPayments = mysqlTable(
  "order_payments",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    orderId: varchar("order_id", { length: 36 })
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    method: mysqlEnum("method", ["cod", "wallet", "instapay"]).notNull(),
    status: mysqlEnum("status", [
      "pending_payment",
      "awaiting_verification",
      "paid",
      "failed",
      "refunded",
      "cash_on_delivery",
    ])
      .notNull()
      .default("pending_payment"),
    amountMinorUnits: int("amount_minor_units", { unsigned: true }).notNull(),
    customerReference: varchar("customer_reference", { length: 255 }),
    verificationNotes: text("verification_notes"),
    verifiedByUserId: varchar("verified_by_user_id", { length: 36 }).references(() => users.id, {
      onDelete: "set null",
    }),
    verifiedAt: timestamp("verified_at", { mode: "date" }).default(sql`NULL`),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    uniqueIndex("order_payments_order_unique").on(table.orderId),
    index("order_payments_status_created_index").on(table.status, table.createdAt),
  ],
);

export const orderShippingHistory = mysqlTable(
  "order_shipping_history",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    orderId: varchar("order_id", { length: 36 })
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    previousStatus: varchar("previous_status", { length: 40 }),
    nextStatus: mysqlEnum("next_status", [
      "pending_confirmation",
      "shipping_details_confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ]).notNull(),
    previousShippingFeeMinorUnits: int("previous_shipping_fee_minor_units", { unsigned: true }),
    nextShippingFeeMinorUnits: int("next_shipping_fee_minor_units", { unsigned: true }).notNull(),
    previousShippingMethod: varchar("previous_shipping_method", { length: 120 }),
    nextShippingMethod: varchar("next_shipping_method", { length: 120 }),
    note: text("note"),
    changedByUserId: varchar("changed_by_user_id", { length: 36 }).references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: createdAt(),
  },
  (table) => [
    index("order_shipping_history_order_created_index").on(table.orderId, table.createdAt),
  ],
);

export const orderPaymentHistory = mysqlTable(
  "order_payment_history",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    paymentId: varchar("payment_id", { length: 36 })
      .notNull()
      .references(() => orderPayments.id, { onDelete: "cascade" }),
    previousStatus: varchar("previous_status", { length: 40 }),
    nextStatus: mysqlEnum("next_status", [
      "pending_payment",
      "awaiting_verification",
      "paid",
      "failed",
      "refunded",
      "cash_on_delivery",
    ]).notNull(),
    previousReference: varchar("previous_reference", { length: 255 }),
    nextReference: varchar("next_reference", { length: 255 }),
    note: text("note"),
    changedByUserId: varchar("changed_by_user_id", { length: 36 }).references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: createdAt(),
  },
  (table) => [
    index("order_payment_history_payment_created_index").on(table.paymentId, table.createdAt),
  ],
);

export const orderAdminNotes = mysqlTable(
  "order_admin_notes",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    orderId: varchar("order_id", { length: 36 })
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    note: text("note").notNull(),
    createdByUserId: varchar("created_by_user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: createdAt(),
  },
  (table) => [index("order_admin_notes_order_created_index").on(table.orderId, table.createdAt)],
);
