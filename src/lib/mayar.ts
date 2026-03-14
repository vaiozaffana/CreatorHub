/**
 * Mayar Payment Gateway Client
 *
 * Handles invoice creation, verification, and webhook signature validation.
 * API Docs: https://docs.mayar.id/api-reference
 */

const MAYAR_API_BASE = "https://api.mayar.id/hl/v1";

function getApiKey(): string {
  const key = process.env.PAYMENT_GATEWAY_SECRET;
  if (!key) throw new Error("PAYMENT_GATEWAY_SECRET is not configured");
  return key;
}

function getWebhookSecret(): string {
  const secret = process.env.PAYMENT_GATEWAY_WEBHOOK_SECRET;
  if (!secret) throw new Error("PAYMENT_GATEWAY_WEBHOOK_SECRET is not configured");
  return secret;
}

// ── Create Invoice ──────────────────────────────────────────────────────

export interface CreateInvoiceParams {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  description: string;
  orderId: string;
  productId: string;
  redirectUrl: string;
}

export interface MayarInvoiceResponse {
  statusCode: number;
  messages: string;
  data: {
    id: string;
    transactionId: string;
    link: string;
    expiredAt: number;
    extraData?: Record<string, string>;
  };
}

export async function createInvoice(
  params: CreateInvoiceParams
): Promise<MayarInvoiceResponse> {
  const apiKey = getApiKey();

  // Expire in 24 hours
  const expiredAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const body = {
    name: params.customerName,
    email: params.customerEmail,
    mobile: params.customerPhone,
    redirectUrl: params.redirectUrl,
    description: params.description,
    expiredAt,
    items: [
      {
        quantity: 1,
        rate: params.amount,
        description: params.description,
      },
    ],
    extraData: {
      noCustomer: params.orderId,
      idProd: params.productId,
    },
  };

  const response = await fetch(`${MAYAR_API_BASE}/invoice/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Mayar create invoice error:", response.status, errorText);
    throw new Error(`Failed to create invoice: ${response.status}`);
  }

  const data: MayarInvoiceResponse = await response.json();

  if (data.statusCode !== 200 && data.statusCode !== 201) {
    console.error("Mayar invoice error:", data);
    throw new Error(`Mayar error: ${data.messages}`);
  }

  return data;
}

// ── Get Invoice Detail ──────────────────────────────────────────────────

export interface MayarInvoiceDetail {
  statusCode: number;
  messages: string;
  data: {
    id: string;
    amount: number;
    status: string;
    link: string;
    type: string;
    expiredAt: number;
    customerId: string;
    transactionId: string;
    paymentUrl: string;
    paymentLinkId: string;
    transactions: Array<{
      id: string;
      status: string;
    }>;
    customer: {
      id: string;
      email: string;
      mobile: string;
      name: string;
    };
  };
}

export async function getInvoiceDetail(
  invoiceId: string
): Promise<MayarInvoiceDetail> {
  const apiKey = getApiKey();

  const response = await fetch(`${MAYAR_API_BASE}/invoice/${invoiceId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Mayar get invoice error:", response.status, errorText);
    throw new Error(`Failed to get invoice: ${response.status}`);
  }

  return response.json();
}

// ── Webhook Signature Verification ──────────────────────────────────────
// Mayar sends webhook with x-callback-token header containing the webhook secret.
// We verify it by comparing with our stored webhook secret.

export function verifyWebhookSignature(callbackToken: string | null): boolean {
  if (!callbackToken) return false;
  const secret = getWebhookSecret();
  return callbackToken === secret;
}

// ── Webhook Payload Type ────────────────────────────────────────────────

export interface MayarWebhookPayload {
  event: string; // "payment.received" | "payment.reminder" | etc.
  data: {
    id: string;
    transactionId: string;
    status: string;
    transactionStatus: string; // "paid" | "created" | etc.
    createdAt: string;
    updatedAt: string;
    merchantId: string;
    merchantName: string;
    merchantEmail: string;
    customerName: string;
    customerEmail: string;
    customerMobile: string;
    amount: number;
    isAdminFeeBorneByCustomer: boolean | null;
    isChannelFeeBorneByCustomer: boolean | null;
    productId: string;
    productName: string;
    productType?: string;
    extraData?: {
      noCustomer?: string; // Our orderId
      idProd?: string;     // Our productId
    };
  };
}
