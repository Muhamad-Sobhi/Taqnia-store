import "server-only";

import { randomUUID } from "node:crypto";
import { asc, desc, eq, sql } from "drizzle-orm";

import { getDatabase } from "@/server/db/connection";
import {
  orderAdminNotes,
  orderItems,
  orderPaymentHistory,
  orderPayments,
  orders,
  orderShippingHistory,
} from "@/server/db/schema";
import { requirePermission } from "@/server/auth/authorization";
import {
  getPaymentUpdateIssue,
  isShippingTransitionAllowed,
  type PaymentUpdateIssue,
  type PaymentStatus,
  type ShippingStatus,
} from "@/lib/order-workflow";

export type { PaymentStatus, ShippingStatus } from "@/lib/order-workflow";

export class AdminOrderNotFoundError extends Error {
  constructor() {
    super("The order was not found.");
    this.name = "AdminOrderNotFoundError";
  }
}

export class InvalidShippingTransitionError extends Error {
  constructor() {
    super("The requested shipping status transition is not allowed.");
    this.name = "InvalidShippingTransitionError";
  }
}

export class InvalidPaymentUpdateError extends Error {
  constructor(issue: PaymentUpdateIssue) {
    const messages: Readonly<Record<PaymentUpdateIssue, string>> = {
      cash_on_delivery_method_required: "Cash-on-delivery status requires the COD payment method.",
      transfer_verification_required:
        "Manual transfer verification notes are required before marking paid.",
      cod_must_be_delivered: "Cash-on-delivery payment can be marked paid after delivery.",
    };
    super(messages[issue]);
    this.name = "InvalidPaymentUpdateError";
  }
}

export class PaymentRecordNotFoundError extends Error {
  constructor() {
    super("The payment record was not found.");
    this.name = "PaymentRecordNotFoundError";
  }
}

const adminOrderPageSize = 50;

export async function listAdminOrders(filter?: ShippingStatus, page = 1) {
  await requirePermission("orders.manage");
  const where = filter ? eq(orders.shippingStatus, filter) : undefined;

  const requestedPage = Number.isSafeInteger(page) && page > 0 ? Math.min(page, 100_000) : 1;
  const countRows = await getDatabase()
    .select({ total: sql<number>`count(*)` })
    .from(orders)
    .where(where);
  const total = Number(countRows[0]?.total ?? 0);
  const pageCount = Math.max(1, Math.ceil(total / adminOrderPageSize));
  const currentPage = Math.min(requestedPage, pageCount);
  const items = await getDatabase()
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      customerName: orders.customerName,
      customerEmail: orders.customerEmail,
      customerPhone: orders.customerPhone,
      subtotalMinorUnits: orders.subtotalMinorUnits,
      shippingFeeMinorUnits: orders.shippingFeeMinorUnits,
      totalMinorUnits: orders.totalMinorUnits,
      shippingStatus: orders.shippingStatus,
      createdAt: orders.createdAt,
      paymentMethod: orderPayments.method,
      paymentStatus: orderPayments.status,
    })
    .from(orders)
    .leftJoin(orderPayments, eq(orderPayments.orderId, orders.id))
    .where(where)
    .orderBy(desc(orders.createdAt))
    .limit(adminOrderPageSize)
    .offset((currentPage - 1) * adminOrderPageSize);

  return { items, total, page: currentPage, pageCount };
}

export async function getAdminOrder(orderNumber: string) {
  await requirePermission("orders.manage");
  const [order] = await getDatabase()
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      customerName: orders.customerName,
      customerEmail: orders.customerEmail,
      customerPhone: orders.customerPhone,
      governorate: orders.governorate,
      cityArea: orders.cityArea,
      streetAddress: orders.streetAddress,
      building: orders.building,
      apartment: orders.apartment,
      postalCode: orders.postalCode,
      deliveryNotes: orders.deliveryNotes,
      shippingMethod: orders.shippingMethod,
      estimatedDelivery: orders.estimatedDelivery,
      subtotalMinorUnits: orders.subtotalMinorUnits,
      shippingFeeMinorUnits: orders.shippingFeeMinorUnits,
      totalMinorUnits: orders.totalMinorUnits,
      shippingStatus: orders.shippingStatus,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
      paymentId: orderPayments.id,
      paymentMethod: orderPayments.method,
      paymentStatus: orderPayments.status,
      paymentAmountMinorUnits: orderPayments.amountMinorUnits,
      customerReference: orderPayments.customerReference,
      verificationNotes: orderPayments.verificationNotes,
    })
    .from(orders)
    .leftJoin(orderPayments, eq(orderPayments.orderId, orders.id))
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);

  if (!order) return null;

  const [items, shippingHistory, paymentHistory, notes] = await Promise.all([
    getDatabase()
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id))
      .orderBy(asc(orderItems.createdAt)),
    getDatabase()
      .select()
      .from(orderShippingHistory)
      .where(eq(orderShippingHistory.orderId, order.id))
      .orderBy(asc(orderShippingHistory.createdAt)),
    order.paymentId
      ? getDatabase()
          .select()
          .from(orderPaymentHistory)
          .where(eq(orderPaymentHistory.paymentId, order.paymentId))
          .orderBy(asc(orderPaymentHistory.createdAt))
      : Promise.resolve([]),
    getDatabase()
      .select()
      .from(orderAdminNotes)
      .where(eq(orderAdminNotes.orderId, order.id))
      .orderBy(asc(orderAdminNotes.createdAt)),
  ]);

  return { ...order, items, shippingHistory, paymentHistory, notes };
}

export async function updateOrderShipping(
  orderNumber: string,
  input: Readonly<{
    nextStatus: ShippingStatus;
    shippingFeeMinorUnits: number;
    shippingMethod: string;
    estimatedDelivery: string;
    deliveryNotes: string;
    note: string;
  }>,
) {
  const session = await requirePermission("shipping.manage");
  const database = getDatabase();

  await database.transaction(async (transaction) => {
    const [order] = await transaction
      .select({
        id: orders.id,
        shippingStatus: orders.shippingStatus,
        subtotalMinorUnits: orders.subtotalMinorUnits,
        shippingFeeMinorUnits: orders.shippingFeeMinorUnits,
        shippingMethod: orders.shippingMethod,
      })
      .from(orders)
      .where(eq(orders.orderNumber, orderNumber))
      .limit(1)
      .for("update");

    if (!order) throw new AdminOrderNotFoundError();
    if (!isShippingTransitionAllowed(order.shippingStatus, input.nextStatus)) {
      throw new InvalidShippingTransitionError();
    }

    const total = order.subtotalMinorUnits + input.shippingFeeMinorUnits;
    if (!Number.isSafeInteger(total) || total > 4_294_967_295) {
      throw new RangeError("The order total exceeds the supported EGP amount.");
    }

    await transaction
      .update(orders)
      .set({
        shippingStatus: input.nextStatus,
        shippingFeeMinorUnits: input.shippingFeeMinorUnits,
        totalMinorUnits: total,
        shippingMethod: input.shippingMethod || null,
        estimatedDelivery: input.estimatedDelivery || null,
        deliveryNotes: input.deliveryNotes || null,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, order.id));
    await transaction
      .update(orderPayments)
      .set({ amountMinorUnits: total, updatedAt: new Date() })
      .where(eq(orderPayments.orderId, order.id));

    await transaction.insert(orderShippingHistory).values({
      id: randomUUID(),
      orderId: order.id,
      previousStatus: order.shippingStatus,
      nextStatus: input.nextStatus,
      previousShippingFeeMinorUnits: order.shippingFeeMinorUnits,
      nextShippingFeeMinorUnits: input.shippingFeeMinorUnits,
      previousShippingMethod: order.shippingMethod,
      nextShippingMethod: input.shippingMethod || null,
      note: input.note || null,
      changedByUserId: session.userId,
    });
  });
}

export async function updateOrderPayment(
  orderNumber: string,
  input: Readonly<{
    status: PaymentStatus;
    reference: string;
    verificationNotes: string;
  }>,
) {
  const session = await requirePermission("payments.verify");
  const database = getDatabase();

  await database.transaction(async (transaction) => {
    const [order] = await transaction
      .select({
        id: orders.id,
        shippingStatus: orders.shippingStatus,
      })
      .from(orders)
      .where(eq(orders.orderNumber, orderNumber))
      .limit(1)
      .for("update");

    if (!order) throw new PaymentRecordNotFoundError();

    const [payment] = await transaction
      .select({
        id: orderPayments.id,
        method: orderPayments.method,
        status: orderPayments.status,
        customerReference: orderPayments.customerReference,
      })
      .from(orderPayments)
      .where(eq(orderPayments.orderId, order.id))
      .limit(1)
      .for("update");

    if (!payment) throw new PaymentRecordNotFoundError();
    const issue = getPaymentUpdateIssue(
      payment.method,
      input.status,
      order.shippingStatus,
      input.verificationNotes,
    );
    if (issue) throw new InvalidPaymentUpdateError(issue);

    await transaction
      .update(orderPayments)
      .set({
        status: input.status,
        customerReference: input.reference || null,
        verificationNotes: input.verificationNotes || null,
        verifiedByUserId: input.status === "paid" ? session.userId : null,
        verifiedAt: input.status === "paid" ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(orderPayments.id, payment.id));

    await transaction.insert(orderPaymentHistory).values({
      id: randomUUID(),
      paymentId: payment.id,
      previousStatus: payment.status,
      nextStatus: input.status,
      previousReference: payment.customerReference,
      nextReference: input.reference || null,
      note: input.verificationNotes || null,
      changedByUserId: session.userId,
    });
  });
}

export async function addOrderAdminNote(orderNumber: string, note: string) {
  const session = await requirePermission("orders.manage");
  const [order] = await getDatabase()
    .select({ id: orders.id })
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);

  if (!order) throw new AdminOrderNotFoundError();

  await getDatabase()
    .insert(orderAdminNotes)
    .values({ id: randomUUID(), orderId: order.id, note, createdByUserId: session.userId });
}
