"use server";

import { prisma } from "@/lib/prisma";
import { createInvoice } from "@/lib/mayar";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://creatorhub-gamma.vercel.app";

export async function createOrder(formData: FormData) {
  const productId = formData.get("productId") as string;
  const buyerEmail = formData.get("buyerEmail") as string;

  if (!productId || !buyerEmail) {
    return { error: "Product ID and email are required" };
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { user: true },
  });

  if (!product) {
    return { error: "Product not found" };
  }

  if (!product.published) {
    return { error: "Product is not available" };
  }

  // Create order
  const order = await prisma.order.create({
    data: {
      productId,
      buyerEmail,
      buyerName: buyerEmail.split("@")[0],
      price: product.price,
      status: "pending",
      isDemo: false,
    },
  });

  // Try to create Mayar invoice (for integration demo, non-blocking)
  let invoiceId: string | null = null;
  let transactionId: string | null = null;
  let paymentUrl: string | null = null;

  try {
    const invoice = await createInvoice({
      customerName: buyerEmail.split("@")[0],
      customerEmail: buyerEmail,
      customerPhone: "081200000000",
      amount: product.price,
      description: `Pembelian: ${product.title}`,
      orderId: order.id,
      productId: product.id,
      redirectUrl: `${APP_URL}/checkout/success?orderId=${order.id}`,
    });
    invoiceId = invoice.data.id;
    transactionId = invoice.data.transactionId;
    paymentUrl = invoice.data.link;
    console.log("Mayar invoice created:", invoiceId);
  } catch (error) {
    // Non-blocking — if Mayar fails, we still proceed with fake payment
    console.warn("Mayar invoice creation skipped (sandbox mode):", error);
  }

  // Create payment record
  await prisma.payment.create({
    data: {
      orderId: order.id,
      status: "pending",
      method: "mayar",
      invoiceId,
      paymentGatewayId: transactionId,
      paymentUrl,
    },
  });

  // Redirect to internal confirm page (fake payment)
  return {
    success: true,
    redirectTo: `/checkout/confirm?orderId=${order.id}`,
  };
}

export async function createDemoOrder(productId: string) {
  if (!productId) {
    return { error: "Product ID is required" };
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return { error: "Product not found" };
  }

  // Create demo order — no real payment
  const order = await prisma.order.create({
    data: {
      productId,
      buyerEmail: "demo@creatorhub.demo",
      price: product.price,
      status: "pending",
      isDemo: true,
    },
  });

  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      status: "pending",
      method: "demo",
    },
  });

  return {
    success: true,
    redirectTo: `/checkout/confirm?orderId=${order.id}&paymentId=${payment.id}`,
  };
}

export async function simulatePaymentSuccess(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payment: true, product: true },
  });

  if (!order) {
    return { error: "Order not found" };
  }

  if (order.status === "completed") {
    return { success: true, redirectTo: `/checkout/success?orderId=${orderId}` };
  }

  // Process payment in a transaction
  await prisma.$transaction(async (tx) => {
    // Update order status
    await tx.order.update({
      where: { id: orderId },
      data: { status: "completed" },
    });

    // Update payment status
    if (order.payment) {
      await tx.payment.update({
        where: { id: order.payment.id },
        data: {
          status: "completed",
          paymentGatewayId: order.payment.paymentGatewayId || `sim_${Date.now()}`,
          paidAt: new Date(),
        },
      });
    }

    // Increment download count (skip for demo)
    if (!order.isDemo) {
      await tx.product.update({
        where: { id: order.productId },
        data: { downloads: { increment: 1 } },
      });
    }
  });

  return { success: true, redirectTo: `/checkout/success?orderId=${orderId}` };
}
