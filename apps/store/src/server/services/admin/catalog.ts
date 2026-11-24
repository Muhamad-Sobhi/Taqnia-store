import "server-only";

import { randomUUID } from "node:crypto";
import { and, asc, eq, inArray, like, or, sql } from "drizzle-orm";

import { getDatabase } from "@/server/db/connection";
import {
  brands,
  categories,
  productCategories,
  productVariants,
  products,
} from "@/server/db/schema";
import { requirePermission } from "@/server/auth/authorization";

export type AdminProductInput = Readonly<{
  slug: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  priceMinorUnits: number;
  brandId: string | null;
  categoryIds: readonly string[];
  sku: string;
  status: "draft" | "published" | "archived";
}>;

const adminListPageSize = 50;

export async function listAdminProducts(query = "", page = 1) {
  await requirePermission("catalog.manage");
  const normalized = query.trim();
  const requestedPage = Number.isSafeInteger(page) && page > 0 ? Math.min(page, 100_000) : 1;
  const where =
    normalized.length > 0
      ? or(
          like(products.nameEn, `%${normalized}%`),
          like(products.nameAr, `%${normalized}%`),
          like(products.slug, `%${normalized}%`),
          like(productVariants.sku, `%${normalized}%`),
        )
      : undefined;
  const productsQuery = getDatabase()
    .select({
      id: products.id,
      slug: products.slug,
      nameEn: products.nameEn,
      nameAr: products.nameAr,
      priceMinorUnits: products.priceMinorUnits,
      status: products.status,
      updatedAt: products.updatedAt,
      sku: productVariants.sku,
    })
    .from(products)
    .leftJoin(
      productVariants,
      and(eq(productVariants.productId, products.id), eq(productVariants.isDefault, true)),
    );

  const countRows = await getDatabase()
    .select({ total: sql<number>`count(distinct ${products.id})` })
    .from(products)
    .leftJoin(
      productVariants,
      and(eq(productVariants.productId, products.id), eq(productVariants.isDefault, true)),
    )
    .where(where);
  const total = Number(countRows[0]?.total ?? 0);
  const pageCount = Math.max(1, Math.ceil(total / adminListPageSize));
  const currentPage = Math.min(requestedPage, pageCount);
  const rows = await productsQuery
    .where(where)
    .orderBy(asc(products.nameEn))
    .limit(adminListPageSize)
    .offset((currentPage - 1) * adminListPageSize);

  return {
    items: rows,
    total,
    page: currentPage,
    pageCount,
  };
}

export async function getAdminProduct(id: string) {
  await requirePermission("catalog.manage");
  const [product] = await getDatabase()
    .select({
      id: products.id,
      slug: products.slug,
      nameEn: products.nameEn,
      nameAr: products.nameAr,
      descriptionEn: products.descriptionEn,
      descriptionAr: products.descriptionAr,
      priceMinorUnits: products.priceMinorUnits,
      brandId: products.brandId,
      status: products.status,
      sku: productVariants.sku,
    })
    .from(products)
    .leftJoin(
      productVariants,
      and(eq(productVariants.productId, products.id), eq(productVariants.isDefault, true)),
    )
    .where(eq(products.id, id))
    .limit(1);

  if (!product) return null;

  const categoryRows = await getDatabase()
    .select({ categoryId: productCategories.categoryId })
    .from(productCategories)
    .where(eq(productCategories.productId, id));

  return { ...product, categoryIds: categoryRows.map((row) => row.categoryId) };
}

export async function listAdminProductOptions() {
  await requirePermission("catalog.manage");
  const [categoryRows, brandRows] = await Promise.all([
    getDatabase()
      .select({ id: categories.id, nameEn: categories.nameEn, nameAr: categories.nameAr })
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(asc(categories.sortOrder), asc(categories.nameEn)),
    getDatabase()
      .select({ id: brands.id, name: brands.name })
      .from(brands)
      .where(eq(brands.isActive, true))
      .orderBy(asc(brands.name)),
  ]);
  return { categories: categoryRows, brands: brandRows };
}

export async function saveAdminProduct(input: AdminProductInput, id?: string) {
  await requirePermission("catalog.manage");
  const database = getDatabase();
  const productId = id ?? randomUUID();
  const now = new Date();

  await database.transaction(async (transaction) => {
    if (id) {
      await transaction
        .update(products)
        .set({
          slug: input.slug,
          nameEn: input.nameEn,
          nameAr: input.nameAr,
          descriptionEn: input.descriptionEn || null,
          descriptionAr: input.descriptionAr || null,
          priceMinorUnits: input.priceMinorUnits,
          brandId: input.brandId,
          status: input.status,
          updatedAt: now,
        })
        .where(eq(products.id, productId));

      const currentDefault = await transaction
        .select({ id: productVariants.id })
        .from(productVariants)
        .where(and(eq(productVariants.productId, productId), eq(productVariants.isDefault, true)))
        .limit(1);

      if (currentDefault[0]) {
        await transaction
          .update(productVariants)
          .set({ sku: input.sku, isActive: input.status !== "archived", updatedAt: now })
          .where(eq(productVariants.id, currentDefault[0].id));
      } else {
        await transaction.insert(productVariants).values({
          id: randomUUID(),
          productId,
          sku: input.sku,
          isDefault: true,
          isActive: input.status !== "archived",
        });
      }

      await transaction.delete(productCategories).where(eq(productCategories.productId, productId));
    } else {
      await transaction.insert(products).values({
        id: productId,
        slug: input.slug,
        nameEn: input.nameEn,
        nameAr: input.nameAr,
        descriptionEn: input.descriptionEn || null,
        descriptionAr: input.descriptionAr || null,
        priceMinorUnits: input.priceMinorUnits,
        brandId: input.brandId,
        currencyCode: "EGP",
        status: input.status,
      });

      await transaction.insert(productVariants).values({
        id: randomUUID(),
        productId,
        sku: input.sku,
        isDefault: true,
        isActive: input.status !== "archived",
      });
    }

    if (input.categoryIds.length > 0) {
      await transaction
        .insert(productCategories)
        .values(input.categoryIds.map((categoryId) => ({ productId, categoryId })));
    }
  });

  return productId;
}

export async function validateProductRelations(input: AdminProductInput) {
  await requirePermission("catalog.manage");
  const [categoryRows, brandRows] = await Promise.all([
    input.categoryIds.length > 0
      ? getDatabase()
          .select({ id: categories.id })
          .from(categories)
          .where(and(inArray(categories.id, [...input.categoryIds]), eq(categories.isActive, true)))
      : Promise.resolve([]),
    input.brandId
      ? getDatabase()
          .select({ id: brands.id })
          .from(brands)
          .where(and(eq(brands.id, input.brandId), eq(brands.isActive, true)))
          .limit(1)
      : Promise.resolve([]),
  ]);

  return (
    categoryRows.length === input.categoryIds.length && (!input.brandId || brandRows.length === 1)
  );
}
