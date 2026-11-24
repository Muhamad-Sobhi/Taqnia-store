export type ShippingStatus =
  | "pending_confirmation"
  | "shipping_details_confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus =
  "pending_payment" | "awaiting_verification" | "paid" | "failed" | "refunded" | "cash_on_delivery";

export type PaymentMethod = "cod" | "wallet" | "instapay";
export type PaymentUpdateIssue =
  "cash_on_delivery_method_required" | "transfer_verification_required" | "cod_must_be_delivered";

const shippingTransitions: Record<ShippingStatus, readonly ShippingStatus[]> = {
  pending_confirmation: ["shipping_details_confirmed", "cancelled"],
  shipping_details_confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export function isShippingTransitionAllowed(
  current: ShippingStatus,
  next: ShippingStatus,
): boolean {
  return current === next || shippingTransitions[current].includes(next);
}

export function nextShippingStatuses(current: ShippingStatus): readonly ShippingStatus[] {
  return [current, ...shippingTransitions[current]];
}

export function getPaymentUpdateIssue(
  method: PaymentMethod,
  nextStatus: PaymentStatus,
  shippingStatus: ShippingStatus,
  verificationNotes: string,
): PaymentUpdateIssue | null {
  if (nextStatus === "cash_on_delivery" && method !== "cod") {
    return "cash_on_delivery_method_required";
  }
  if (nextStatus === "paid" && method !== "cod" && !verificationNotes.trim()) {
    return "transfer_verification_required";
  }
  if (nextStatus === "paid" && method === "cod" && shippingStatus !== "delivered") {
    return "cod_must_be_delivered";
  }
  return null;
}
