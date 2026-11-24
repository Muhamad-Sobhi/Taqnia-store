import { z } from "zod";

const productFormSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(180)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  nameEn: z.string().trim().min(1).max(255),
  nameAr: z.string().trim().min(1).max(255),
  descriptionEn: z.string().trim().max(10_000),
  descriptionAr: z.string().trim().max(10_000),
  priceEgp: z
    .string()
    .trim()
    .regex(/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/),
  brandId: z.union([z.literal(""), z.string().uuid()]),
  categoryIds: z.array(z.string().uuid()).max(100),
  sku: z.string().trim().min(1).max(120),
  status: z.enum(["draft", "published", "archived"]),
});

export type ParsedProductForm = Readonly<{
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

export function parseEgpMinorUnits(value: string): number | null {
  const match = /^(0|[1-9]\d*)(?:\.(\d{1,2}))?$/.exec(value);
  if (!match) return null;

  const whole = match[1];
  if (!whole) return null;
  const fraction = (match[2] ?? "").padEnd(2, "0");
  const minorUnits = BigInt(whole) * 100n + BigInt(fraction || "0");
  if (minorUnits < 0n || minorUnits > 4_294_967_295n) return null;
  return Number(minorUnits);
}

export function parseProductForm(formData: FormData): ParsedProductForm | null {
  const parsed = productFormSchema.safeParse({
    slug: formData.get("slug"),
    nameEn: formData.get("nameEn"),
    nameAr: formData.get("nameAr"),
    descriptionEn: formData.get("descriptionEn"),
    descriptionAr: formData.get("descriptionAr"),
    priceEgp: formData.get("priceEgp"),
    brandId: formData.get("brandId"),
    categoryIds: formData.getAll("categoryIds"),
    sku: formData.get("sku"),
    status: formData.get("status"),
  });
  if (!parsed.success) return null;

  const priceMinorUnits = parseEgpMinorUnits(parsed.data.priceEgp);
  if (
    priceMinorUnits === null ||
    priceMinorUnits === 0 ||
    new Set(parsed.data.categoryIds).size !== parsed.data.categoryIds.length
  ) {
    return null;
  }

  return {
    ...parsed.data,
    priceMinorUnits,
    brandId: parsed.data.brandId || null,
  };
}
