"use client";

import { useActionState } from "react";

import { adminStoreCopy, getAdminStatusLabel } from "@/content/admin-store";
import { formatEgpInput } from "@/lib/currency";
import type { Locale } from "@/lib/locale";
import {
  nextShippingStatuses,
  type PaymentStatus,
  type ShippingStatus,
} from "@/lib/order-workflow";
import type { AdminOrderActionState } from "@/server/admin/order-actions";
import {
  addOrderAdminNoteAction,
  updateOrderPaymentAction,
  updateOrderShippingAction,
} from "@/server/admin/order-actions";

type OrderControlsProps = Readonly<{
  locale: Locale;
  orderNumber: string;
  shippingStatus: ShippingStatus;
  shippingFeeMinorUnits: number;
  shippingMethod: string | null;
  estimatedDelivery: string | null;
  deliveryNotes: string | null;
  paymentMethod: "cod" | "wallet" | "instapay" | null;
  paymentStatus: PaymentStatus | null;
  paymentReference: string | null;
  verificationNotes: string | null;
  canManageShipping: boolean;
  canVerifyPayments: boolean;
  canAddNotes: boolean;
}>;

const initialState: AdminOrderActionState = { error: null };

export function OrderControls({
  locale,
  orderNumber,
  shippingStatus,
  shippingFeeMinorUnits,
  shippingMethod,
  estimatedDelivery,
  deliveryNotes,
  paymentMethod,
  paymentStatus,
  paymentReference,
  verificationNotes,
  canManageShipping,
  canVerifyPayments,
  canAddNotes,
}: OrderControlsProps) {
  const copy = adminStoreCopy[locale];
  const [shippingState, shippingAction, shippingPending] = useActionState(
    updateOrderShippingAction,
    initialState,
  );
  const [paymentState, paymentAction, paymentPending] = useActionState(
    updateOrderPaymentAction,
    initialState,
  );
  const [noteState, noteAction, notePending] = useActionState(
    addOrderAdminNoteAction,
    initialState,
  );

  return (
    <div className="admin-controls-grid">
      {canManageShipping ? (
        <section>
          <h2>{copy.updateShipping}</h2>
          <form action={shippingAction} className="admin-form">
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="orderNumber" value={orderNumber} />
            <label>
              {copy.shippingStatus}
              <select name="shippingStatus" defaultValue={shippingStatus}>
                {nextShippingStatuses(shippingStatus).map((status) => (
                  <option key={status} value={status}>
                    {getAdminStatusLabel(locale, status)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {copy.shippingFee}
              <input
                name="shippingFeeEgp"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                defaultValue={formatEgpInput(shippingFeeMinorUnits)}
                required
              />
            </label>
            <label>
              {copy.shippingMethod}
              <input name="shippingMethod" maxLength={120} defaultValue={shippingMethod ?? ""} />
            </label>
            <label>
              {copy.estimatedDelivery}
              <input
                name="estimatedDelivery"
                maxLength={160}
                defaultValue={estimatedDelivery ?? ""}
              />
            </label>
            <label>
              {copy.deliveryNotes}
              <textarea name="deliveryNotes" maxLength={2_000} defaultValue={deliveryNotes ?? ""} />
            </label>
            <label>
              {copy.notePlaceholder}
              <input name="shippingNote" maxLength={2_000} />
            </label>
            {shippingState.error ? (
              <p className="form-error" role="alert">
                {shippingState.error}
              </p>
            ) : null}
            <button className="button button--primary" type="submit" disabled={shippingPending}>
              {copy.saveChanges}
            </button>
          </form>
        </section>
      ) : null}

      {canVerifyPayments && paymentStatus && paymentMethod ? (
        <section>
          <h2>{copy.updatePayment}</h2>
          <form action={paymentAction} className="admin-form">
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="orderNumber" value={orderNumber} />
            <label>
              {copy.paymentStatus}
              <select name="paymentStatus" defaultValue={paymentStatus}>
                <option value="pending_payment">{copy.pendingPayment}</option>
                <option value="awaiting_verification">{copy.awaitingVerification}</option>
                <option value="paid">{copy.paid}</option>
                <option value="failed">{copy.failed}</option>
                <option value="refunded">{copy.refunded}</option>
                {paymentMethod === "cod" ? (
                  <option value="cash_on_delivery">{copy.cashOnDelivery}</option>
                ) : null}
              </select>
            </label>
            <label>
              {copy.paymentReference}
              <input
                name="paymentReference"
                maxLength={255}
                defaultValue={paymentReference ?? ""}
              />
            </label>
            <label>
              {copy.verificationNotes}
              <textarea
                name="verificationNotes"
                maxLength={2_000}
                defaultValue={verificationNotes ?? ""}
              />
            </label>
            {paymentState.error ? (
              <p className="form-error" role="alert">
                {paymentState.error}
              </p>
            ) : null}
            <button className="button button--primary" type="submit" disabled={paymentPending}>
              {copy.saveChanges}
            </button>
          </form>
        </section>
      ) : null}

      {canAddNotes ? (
        <section>
          <h2>{copy.adminNotes}</h2>
          <form action={noteAction} className="admin-form">
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="orderNumber" value={orderNumber} />
            <label>
              {copy.notePlaceholder}
              <textarea name="note" maxLength={2_000} required />
            </label>
            {noteState.error ? (
              <p className="form-error" role="alert">
                {noteState.error}
              </p>
            ) : null}
            <button className="button button--primary" type="submit" disabled={notePending}>
              {copy.addNote}
            </button>
          </form>
        </section>
      ) : null}
    </div>
  );
}
