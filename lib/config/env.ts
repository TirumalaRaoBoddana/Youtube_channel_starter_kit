import "server-only";

function req(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required environment variable: ${name}`);
  return v;
}

export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  authSecret: process.env.AUTH_SECRET ?? "dev-insecure-secret-change-me",
  adminEmails: (process.env.ADMIN_EMAILS ?? "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean),
  text: {
    provider: process.env.TEXT_AI_PROVIDER ?? "demo",
    apiKey: process.env.TEXT_AI_API_KEY ?? "",
    model: process.env.TEXT_AI_MODEL ?? "",
  },
  image: {
    provider: process.env.IMAGE_AI_PROVIDER ?? "demo",
    apiKey: process.env.IMAGE_AI_API_KEY ?? "",
    model: process.env.IMAGE_AI_MODEL ?? "",
  },
  storage: {
    driver: process.env.STORAGE_DRIVER ?? "local",
    bucket: process.env.STORAGE_BUCKET ?? "channelforge",
  },
  payment: {
    provider: process.env.PAYMENT_PROVIDER ?? "disabled",
    secretKey: process.env.PAYMENT_SECRET_KEY ?? "",
    webhookSecret: process.env.PAYMENT_WEBHOOK_SECRET ?? "",
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
  },
  adsenseClientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "",
};
