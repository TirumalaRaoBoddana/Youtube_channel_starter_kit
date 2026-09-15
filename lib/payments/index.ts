import "server-only";
import { env } from "../config/env";

export interface PaymentProvider {
  readonly name: string;
  createCheckout(opts: { userId: string; plan: "pro"; priceId?: string }): Promise<{ url: string }>;
  verifyWebhook(payload: string, signature: string | null): Promise<{ type: string; userId?: string; status?: string } | null>;
}

class DisabledProvider implements PaymentProvider {
  readonly name = "disabled";
  async createCheckout(): Promise<{ url: string }> {
    throw new Error("PAYMENTS_NOT_CONFIGURED: set PAYMENT_PROVIDER and PAYMENT_SECRET_KEY to enable checkout.");
  }
  async verifyWebhook() { return null; }
}

export const payments: PaymentProvider = new DisabledProvider();
export const paymentsEnabled = env.payment.provider !== "disabled" && Boolean(env.payment.secretKey);
