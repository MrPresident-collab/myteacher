export type PaymentProvider = "multicaixa_express" | "payment_reference";

export type PaymentRequest = {
  bookingId: string;
  learnerId: string;
  amount: number;
  currencyCode: "AOA";
  idempotencyKey: string;
};

export type PaymentIntent = {
  transactionId: string;
  provider: PaymentProvider;
  status: "pending";
  providerReference?: string;
  checkoutUrl?: string;
  expiresAt?: string;
};

export interface PaymentGateway {
  createPayment(request: PaymentRequest): Promise<PaymentIntent>;
  confirmWebhook(payload: unknown, signature: string): Promise<{ providerEventId: string; transactionId: string; status: "confirmed" | "failed" | "expired" | "refunded" }>;
}

export function getConfiguredPaymentProvider(): PaymentProvider {
  const provider = import.meta.env.VITE_PAYMENT_PROVIDER;
  if (provider === "multicaixa_express" || provider === "payment_reference") return provider;
  throw new Error("No payment provider is configured. Payment credentials must remain server-side.");
}