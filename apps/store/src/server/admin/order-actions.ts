"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { adminStoreCopy } from "@/content/admin-store";
import { isLocale } from "@/lib/locale";
import { parseEgpMinorUnits } from "@/server/services/admin/product-validation";
import {
  addOrderAdminNote,
  AdminOrderNotFoundError,
  InvalidPaymentUpdateError,
  InvalidShippingTransitionError,
  PaymentRecordNotFoundError,
  updateOrderPayment,
  updateOrderShipping,
} from "@/server/services/admin/orders";

export type AdminOrderActionState = Readonly<{ error: string | null }>;

const orderNumberSchema = z.string().regex(/^[A-Za-z0-9_-]{1,32}$/);
const shippingStatusSchema = z.enum([
  "pending_confirmation",
  "shipping_details_confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);
const paymentStatusSchema = z.enum([
  "pending_payment",
  "awaiting_verification",
  "paid",
  "failed",
  "refunded",
  "cash_on_delivery",
]);

function getLocale(formData: FormData) {
  const localeValue = formData.get("locale");
  return typeof localeValue === "string" && isLocale(localeValue) ? localeValue : null;
}

function getOrderNumber(formData: FormData) {
  return orderNumberSchema.safeParse(formData.get("orderNumber"));
}

export async function updateOrderShippingAction(
  _previousState: AdminOrderActionState,
  formData: FormData,
): Promise<AdminOrderActionState> {
  const locale = getLocale(formData);
  if (!locale) return { error: adminStoreCopy.en.invalidLocale };
  const copy = adminStoreCopy[locale];
  const orderNumber = getOrderNumber(formData);
  const status = shippingStatusSchema.safeParse(formData.get("shippingStatus"));
  const feeRaw = formData.get("shippingFeeEgp");
  if (!orderNumber.success || !status.success || typeof feeRaw !== "string" || feeRaw.length > 16) {
    return { error: copy.updateFailed };
  }
  const shippingFeeMinorUnits = parseEgpMinorUnits(feeRaw);
  if (shippingFeeMinorUnits === null) return { error: copy.updateFailed };

  const boundedField = (name: string, maxLength: number) => {
    const value = formData.get(name);
    return typeof value === "string" && value.length <= maxLength ? value.trim() : null;
  };
  const shippingMethod = boundedField("shippingMethod", 120);
  const estimatedDelivery = boundedField("estimatedDelivery", 160);
  const deliveryNotes = boundedField("deliveryNotes", 2_000);
  const note = boundedField("shippingNote", 2_000);
  if (
    shippingMethod === null ||
    estimatedDelivery === null ||
    deliveryNotes === null ||
    note === null
  ) {
    return { error: copy.updateFailed };
  }

  try {
    await updateOrderShipping(orderNumber.data, {
      nextStatus: status.data,
      shippingFeeMinorUnits,
      shippingMethod,
      estimatedDelivery,
      deliveryNotes,
      note,
    });
  } catch (error) {
    if (
      error instanceof AdminOrderNotFoundError ||
      error instanceof InvalidShippingTransitionError
    ) {
      return { error: copy.updateFailed };
    }
    throw error;
  }

  redirect(`/${locale}/admin/orders/${orderNumber.data}`);
}

export async function updateOrderPaymentAction(
  _previousState: AdminOrderActionState,
  formData: FormData,
): Promise<AdminOrderActionState> {
  const locale = getLocale(formData);
  if (!locale) return { error: adminStoreCopy.en.invalidLocale };
  const copy = adminStoreCopy[locale];
  const orderNumber = getOrderNumber(formData);
  const status = paymentStatusSchema.safeParse(formData.get("paymentStatus"));
  const reference = formData.get("paymentReference");
  const verificationNotes = formData.get("verificationNotes");
  if (
    !orderNumber.success ||
    !status.success ||
    typeof reference !== "string" ||
    reference.length > 255 ||
    typeof verificationNotes !== "string" ||
    verificationNotes.length > 2_000
  ) {
    return { error: copy.updateFailed };
  }

  try {
    await updateOrderPayment(orderNumber.data, {
      status: status.data,
      reference: reference.trim(),
      verificationNotes: verificationNotes.trim(),
    });
  } catch (error) {
    if (error instanceof PaymentRecordNotFoundError || error instanceof InvalidPaymentUpdateError) {
      return { error: copy.updateFailed };
    }
    throw error;
  }

  redirect(`/${locale}/admin/orders/${orderNumber.data}`);
}

export async function addOrderAdminNoteAction(
  _previousState: AdminOrderActionState,
  formData: FormData,
): Promise<AdminOrderActionState> {
  const locale = getLocale(formData);
  if (!locale) return { error: adminStoreCopy.en.invalidLocale };
  const copy = adminStoreCopy[locale];
  const orderNumber = getOrderNumber(formData);
  const note = formData.get("note");
  if (
    !orderNumber.success ||
    typeof note !== "string" ||
    note.trim().length === 0 ||
    note.length > 2_000
  ) {
    return { error: copy.updateFailed };
  }

  try {
    await addOrderAdminNote(orderNumber.data, note.trim());
  } catch (error) {
    if (error instanceof AdminOrderNotFoundError) return { error: copy.updateFailed };
    throw error;
  }

  redirect(`/${locale}/admin/orders/${orderNumber.data}`);
}
