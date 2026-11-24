"use server";

import { redirect } from "next/navigation";

import { adminStoreCopy } from "@/content/admin-store";
import { isLocale } from "@/lib/locale";
import { parseProductForm } from "@/server/services/admin/product-validation";
import { saveAdminProduct, validateProductRelations } from "@/server/services/admin/catalog";

export type AdminProductActionState = Readonly<{ error: string | null }>;

function isDuplicateEntryError(error: unknown): boolean {
  return (
    typeof error === "object" && error !== null && "code" in error && error.code === "ER_DUP_ENTRY"
  );
}

export async function saveAdminProductAction(
  _previousState: AdminProductActionState,
  formData: FormData,
): Promise<AdminProductActionState> {
  const localeValue = formData.get("locale");
  if (typeof localeValue !== "string" || !isLocale(localeValue)) {
    return { error: adminStoreCopy.en.invalidLocale };
  }

  const copy = adminStoreCopy[localeValue];
  const product = parseProductForm(formData);
  if (!product) return { error: copy.invalidProduct };
  if (!(await validateProductRelations(product))) return { error: copy.invalidProduct };

  const productId = formData.get("productId");
  if (
    productId !== null &&
    (typeof productId !== "string" || !/^[0-9a-f-]{36}$/i.test(productId))
  ) {
    return { error: copy.invalidProduct };
  }

  try {
    await saveAdminProduct(product, typeof productId === "string" ? productId : undefined);
  } catch (error) {
    if (isDuplicateEntryError(error)) return { error: copy.invalidProduct };
    throw error;
  }

  redirect(`/${localeValue}/admin/products`);
}
