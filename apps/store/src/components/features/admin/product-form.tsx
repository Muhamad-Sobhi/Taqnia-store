"use client";

import Link from "next/link";
import { useActionState } from "react";

import { adminStoreCopy } from "@/content/admin-store";
import { formatEgpInput } from "@/lib/currency";
import type { Locale } from "@/lib/locale";
import {
  saveAdminProductAction,
  type AdminProductActionState,
} from "@/server/admin/product-actions";

type ProductFormProduct = Readonly<{
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  priceMinorUnits: number | null;
  brandId: string | null;
  sku: string | null;
  status: "draft" | "published" | "archived";
  categoryIds: readonly string[];
}>;

type ProductFormProps = Readonly<{
  locale: Locale;
  categories: readonly Readonly<{ id: string; nameEn: string; nameAr: string }>[];
  brands: readonly Readonly<{ id: string; name: string }>[];
  product?: ProductFormProduct;
}>;

const initialState: AdminProductActionState = { error: null };

export function ProductForm({ locale, categories, brands, product }: ProductFormProps) {
  const copy = adminStoreCopy[locale];
  const [state, formAction, pending] = useActionState(saveAdminProductAction, initialState);

  return (
    <form action={formAction} className="admin-form">
      <input type="hidden" name="locale" value={locale} />
      {product ? <input type="hidden" name="productId" value={product.id} /> : null}
      <label>
        {copy.productNameEn}
        <input name="nameEn" maxLength={255} defaultValue={product?.nameEn} required />
      </label>
      <label>
        {copy.productNameAr}
        <input name="nameAr" maxLength={255} defaultValue={product?.nameAr} required />
      </label>
      <label>
        {copy.slug}
        <input
          name="slug"
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          maxLength={180}
          defaultValue={product?.slug}
          required
        />
      </label>
      <label>
        {copy.descriptionEn}
        <textarea
          name="descriptionEn"
          maxLength={10_000}
          defaultValue={product?.descriptionEn ?? ""}
        />
      </label>
      <label>
        {copy.descriptionAr}
        <textarea
          name="descriptionAr"
          maxLength={10_000}
          defaultValue={product?.descriptionAr ?? ""}
        />
      </label>
      <label>
        {copy.priceEgp}
        <input
          name="priceEgp"
          type="number"
          min="0.01"
          step="0.01"
          inputMode="decimal"
          defaultValue={
            product?.priceMinorUnits === null || product?.priceMinorUnits === undefined
              ? ""
              : formatEgpInput(product.priceMinorUnits)
          }
          required
        />
      </label>
      <label>
        {copy.sku}
        <input name="sku" maxLength={120} defaultValue={product?.sku ?? ""} required />
      </label>
      <label>
        {copy.brand}
        <select name="brandId" defaultValue={product?.brandId ?? ""}>
          <option value="">{copy.noBrand}</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </label>
      <fieldset>
        <legend>{copy.category}</legend>
        <div className="admin-checkbox-list">
          {categories.map((category) => (
            <label key={category.id} className="admin-checkbox">
              <input
                type="checkbox"
                name="categoryIds"
                value={category.id}
                defaultChecked={product?.categoryIds.includes(category.id)}
              />
              {locale === "ar" ? category.nameAr : category.nameEn}
            </label>
          ))}
        </div>
      </fieldset>
      <label>
        {copy.status}
        <select name="status" defaultValue={product?.status ?? "draft"}>
          <option value="draft">{copy.draft}</option>
          <option value="published">{copy.published}</option>
          <option value="archived">{copy.archived}</option>
        </select>
      </label>
      {state.error ? (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      ) : null}
      <div className="admin-form__actions">
        <button className="button button--primary" type="submit" disabled={pending}>
          {pending ? copy.saveChanges : copy.save}
        </button>
        <Link className="button button--secondary" href={`/${locale}/admin/products`}>
          {copy.cancel}
        </Link>
      </div>
    </form>
  );
}
