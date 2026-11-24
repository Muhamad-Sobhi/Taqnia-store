import "server-only";

import { and, asc, eq, inArray, isNotNull, like, or } from "drizzle-orm";

import { getDatabase } from "@/server/db/connection";
import {
  attributeDefinitions,
  categories,
  productAttributeValues,
  productCategories,
  productImages,
  productVariants,
  products,
} from "@/server/db/schema";
import type { StoreCategory } from "@/content/categories";
import type { StoreProduct } from "@/content/products";
import type { Locale } from "@/lib/locale";
import { escapeLikePattern } from "@/lib/search";

export type CatalogProductDetail = Readonly<{
  product: StoreProduct;
  specifications: readonly Readonly<{
    label: string;
    value: string | boolean;
    unit: string | null;
  }>[];
}>;

export async function listPublishedCategories(): Promise<StoreCategory[]> {
  const rows = await getDatabase()
    .select({
      slug: categories.slug,
      nameEn: categories.nameEn,
      nameAr: categories.nameAr,
    })
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(asc(categories.sortOrder), asc(categories.nameEn));

  return rows.map((row) => ({
    slug: row.slug,
    name: { en: row.nameEn, ar: row.nameAr },
  }));
}

async function getProductViews(
  filters: { categorySlug?: string; query?: string } = {},
): Promise<StoreProduct[]> {
  const conditions = [
    eq(products.status, "published"),
    eq(products.currencyCode, "EGP"),
    isNotNull(products.priceMinorUnits),
  ];

  if (filters.categorySlug) {
    conditions.push(
      inArray(
        products.id,
        getDatabase()
          .select({ productId: productCategories.productId })
          .from(productCategories)
          .innerJoin(categories, eq(categories.id, productCategories.categoryId))
          .where(and(eq(categories.slug, filters.categorySlug), eq(categories.isActive, true))),
      ),
    );
  }

  if (filters.query) {
    const pattern = `%${escapeLikePattern(filters.query)}%`;
    const textMatch = or(
      like(products.nameEn, pattern),
      like(products.nameAr, pattern),
      like(products.descriptionEn, pattern),
      like(products.descriptionAr, pattern),
    );
    if (!textMatch) {
      throw new Error("A product search must include at least one searchable field.");
    }

    conditions.push(textMatch);
  }

  const rows = await getDatabase()
    .select({
      id: products.id,
      slug: products.slug,
      nameEn: products.nameEn,
      nameAr: products.nameAr,
      descriptionEn: products.descriptionEn,
      descriptionAr: products.descriptionAr,
      priceMinorUnits: products.priceMinorUnits,
    })
    .from(products)
    .where(and(...conditions))
    .orderBy(asc(products.nameEn));

  if (rows.length === 0) {
    return [];
  }

  const productIds = rows.map((row) => row.id);
  const [categoryRows, imageRows] = await Promise.all([
    getDatabase()
      .select({
        productId: productCategories.productId,
        slug: categories.slug,
      })
      .from(productCategories)
      .innerJoin(categories, eq(categories.id, productCategories.categoryId))
      .where(inArray(productCategories.productId, productIds))
      .orderBy(asc(categories.sortOrder)),
    getDatabase()
      .select({
        productId: productImages.productId,
        imagePath: productImages.imagePath,
      })
      .from(productImages)
      .where(inArray(productImages.productId, productIds))
      .orderBy(asc(productImages.sortOrder)),
  ]);

  const categoryByProduct = new Map<string, string>();
  for (const row of categoryRows) {
    if (!categoryByProduct.has(row.productId)) {
      categoryByProduct.set(row.productId, row.slug);
    }
  }

  const imageByProduct = new Map<string, string>();
  for (const row of imageRows) {
    if (!imageByProduct.has(row.productId)) {
      imageByProduct.set(row.productId, row.imagePath);
    }
  }

  return rows.flatMap((row) => {
    if (row.priceMinorUnits === null) {
      return [];
    }

    return [
      {
        slug: row.slug,
        name: { en: row.nameEn, ar: row.nameAr },
        description: {
          en: row.descriptionEn ?? "",
          ar: row.descriptionAr ?? "",
        },
        categorySlug: categoryByProduct.get(row.id) ?? null,
        priceMinorUnits: row.priceMinorUnits,
        imageUrl: imageByProduct.get(row.id) ?? null,
      },
    ];
  });
}

export async function listPublishedProducts(categorySlug?: string): Promise<StoreProduct[]> {
  return getProductViews({ categorySlug });
}

export async function searchPublishedCatalog(
  query: string,
): Promise<{ categories: StoreCategory[]; products: StoreProduct[] }> {
  const normalizedQuery = query.trim();
  if (normalizedQuery.length === 0) {
    return { categories: [], products: [] };
  }
  if (normalizedQuery.length > 120) {
    throw new RangeError("Catalog search must be 120 characters or fewer.");
  }

  const pattern = `%${escapeLikePattern(normalizedQuery)}%`;
  const categoryMatch = or(like(categories.nameEn, pattern), like(categories.nameAr, pattern));
  if (!categoryMatch) {
    throw new Error("A category search must include at least one searchable field.");
  }

  const [categoryRows, productRows] = await Promise.all([
    getDatabase()
      .select({
        slug: categories.slug,
        nameEn: categories.nameEn,
        nameAr: categories.nameAr,
      })
      .from(categories)
      .where(and(eq(categories.isActive, true), categoryMatch))
      .orderBy(asc(categories.sortOrder), asc(categories.nameEn)),
    getProductViews({ query: normalizedQuery }),
  ]);

  return {
    categories: categoryRows.map((row) => ({
      slug: row.slug,
      name: { en: row.nameEn, ar: row.nameAr },
    })),
    products: productRows,
  };
}

export async function getPublishedProduct(
  slug: string,
  locale: Locale,
): Promise<CatalogProductDetail | null> {
  const [row] = await getDatabase()
    .select({
      id: products.id,
      slug: products.slug,
      nameEn: products.nameEn,
      nameAr: products.nameAr,
      descriptionEn: products.descriptionEn,
      descriptionAr: products.descriptionAr,
      priceMinorUnits: products.priceMinorUnits,
    })
    .from(products)
    .where(
      and(
        eq(products.slug, slug),
        eq(products.status, "published"),
        eq(products.currencyCode, "EGP"),
        isNotNull(products.priceMinorUnits),
      ),
    )
    .limit(1);

  if (!row || row.priceMinorUnits === null) {
    return null;
  }

  const [categoryRows, imageRows, specificationRows] = await Promise.all([
    getDatabase()
      .select({ slug: categories.slug })
      .from(productCategories)
      .innerJoin(categories, eq(categories.id, productCategories.categoryId))
      .where(eq(productCategories.productId, row.id))
      .orderBy(asc(categories.sortOrder))
      .limit(1),
    getDatabase()
      .select({ imagePath: productImages.imagePath })
      .from(productImages)
      .where(eq(productImages.productId, row.id))
      .orderBy(asc(productImages.sortOrder))
      .limit(1),
    getDatabase()
      .select({
        labelEn: attributeDefinitions.labelEn,
        labelAr: attributeDefinitions.labelAr,
        unit: attributeDefinitions.unit,
        valueType: attributeDefinitions.valueType,
        valueText: productAttributeValues.valueText,
        valueNumber: productAttributeValues.valueNumber,
        valueBoolean: productAttributeValues.valueBoolean,
      })
      .from(productVariants)
      .innerJoin(productAttributeValues, eq(productAttributeValues.variantId, productVariants.id))
      .innerJoin(
        attributeDefinitions,
        eq(attributeDefinitions.id, productAttributeValues.attributeId),
      )
      .where(and(eq(productVariants.productId, row.id), eq(productVariants.isActive, true))),
  ]);

  const product: StoreProduct = {
    slug: row.slug,
    name: { en: row.nameEn, ar: row.nameAr },
    description: { en: row.descriptionEn ?? "", ar: row.descriptionAr ?? "" },
    categorySlug: categoryRows[0]?.slug ?? null,
    priceMinorUnits: row.priceMinorUnits,
    imageUrl: imageRows[0]?.imagePath ?? null,
  };

  return {
    product,
    specifications: specificationRows.flatMap((specification) => {
      const value =
        specification.valueType === "boolean"
          ? specification.valueBoolean
          : specification.valueType === "number"
            ? specification.valueNumber
            : specification.valueText;

      if (value === null) {
        return [];
      }

      return [
        {
          label: locale === "ar" ? specification.labelAr : specification.labelEn,
          value,
          unit: specification.unit,
        },
      ];
    }),
  };
}
