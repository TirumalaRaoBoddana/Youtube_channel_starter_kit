import { NextRequest } from "next/server";
import { ok } from "@/lib/utils/api-response";
import { resolveIdentity } from "@/lib/auth/identity";
import { usageSummary } from "@/lib/rate-limit";
import { LIMITS } from "@/lib/config/limits";

export async function GET(req: NextRequest) {
  const idn = resolveIdentity(req);
  return ok({ usage: usageSummary(idn.user?.id ?? null, idn.guestToken), limits: LIMITS[idn.plan], plan: idn.plan });
}
