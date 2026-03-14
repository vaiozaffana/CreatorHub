import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyWebhookSignature,
  getInvoiceDetail,
  type MayarWebhookPayload,
} from "@/lib/mayar";

/**
 * Mayar Payment Webhook Handler
 *
 * Flow:
 * 1. Verify webhook signature (x-callback-token)
 * 2. Parse & validate payload
 * 3. Verify invoice via Mayar API (double-check amount & status)
 * 4. Update order + payment status
 */
export async function POST(request: NextRequest) {
  try {
    // ── Step 1: Verify webhook signature ────────────────────────────────
    const callbackToken = request.headers.get("x-callback-token");

    if (!verifyWebhookSignature(callbackToken)) {
      console.error("Webhook signature verification failed");
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    // ── Step 2: Parse payload ───────────────────────────────────────────
    const payload: MayarWebhookPayload = await request.json();

    console.log("Webhook received:", {
      event: payload.event,
      transactionId: payload.data?.transactionId,
      status: payload.data?.transactionStatus,
      amount: payload.data?.amount,
    });

    // Only process payment.received events with paid status
    if (
      payload.event !== "payment.received" ||
      payload.data?.transactionStatus !== "paid"
    ) {
      console.log("Skipping non-payment event:", payload.event);
      return NextResponse.json({ success: true, message: "Event skipped" });
    }

    const { data } = payload;
    const orderId = data.extraData?.noCustomer;

    if (!orderId) {
      console.error("No orderId in webhook extraData");
      return NextResponse.json(
        { error: "Missing order reference" },
        { status: 400 }
      );
    }

    // ── Step 3: Verify invoice via Mayar API ────────────────────────────
    // Find the payment record to get the invoiceId
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true, product: true },
    });

    if (!existingOrder) {
      console.error("Order not found:", orderId);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (existingOrder.status === "completed") {
      console.log("Order already completed, skipping:", orderId);
      return NextResponse.json({
        success: true,
        message: "Already processed",
      });
    }

    // Verify with Mayar API if we have an invoiceId
    if (existingOrder.payment?.invoiceId) {
      try {
        const invoiceDetail = await getInvoiceDetail(
          existingOrder.payment.invoiceId
        );

        // Verify amount matches
        if (invoiceDetail.data.amount !== existingOrder.price) {
          console.error("Amount mismatch!", {
            expected: existingOrder.price,
            received: invoiceDetail.data.amount,
          });
          return NextResponse.json(
            { error: "Amount verification failed" },
            { status: 400 }
          );
        }

        // Verify invoice is actually paid
        const hasPaidTransaction = invoiceDetail.data.transactions?.some(
          (t) => t.status === "paid"
        );

        if (invoiceDetail.data.status !== "paid" && !hasPaidTransaction) {
          console.error("Invoice not paid:", invoiceDetail.data.status);
          return NextResponse.json(
            { error: "Invoice not yet paid" },
            { status: 400 }
          );
        }
      } catch (verifyError) {
        console.error("Invoice verification error:", verifyError);
        // Continue processing — webhook signature was valid
        // Log but don't block in case Mayar API is temporarily down
      }
    }

    // ── Step 4: Update order & payment ──────────────────────────────────
    await prisma.$transaction(async (tx) => {
      // Update order
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: "completed",
          buyerName: data.customerName || undefined,
          buyerPhone: data.customerMobile || undefined,
        },
      });

      // Update payment
      if (existingOrder.payment) {
        await tx.payment.update({
          where: { id: existingOrder.payment.id },
          data: {
            status: "completed",
            paymentGatewayId: data.transactionId,
            paidAt: new Date(),
          },
        });
      }

      // Increment download count
      await tx.product.update({
        where: { id: existingOrder.productId },
        data: { downloads: { increment: 1 } },
      });
    });

    console.log("Webhook processed successfully for order:", orderId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
