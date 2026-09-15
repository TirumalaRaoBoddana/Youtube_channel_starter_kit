import { NextRequest } from "next/server";
import { ok } from "@/lib/utils/api-response";
import { guardApi } from "@/lib/auth/guard";
import { destroySession } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  const g = guardApi(req);
  if (g.error) return g.error;
  destroySession();
  return ok({ loggedOut: true });
}
