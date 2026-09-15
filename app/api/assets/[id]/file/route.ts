import { NextRequest, NextResponse } from "next/server";
import { collections } from "@/lib/db";
import { storage } from "@/lib/storage";
import { getCurrentUser, getGuestToken } from "@/lib/auth/session";

// Serves asset bytes from storage. In production with S3 this route would
// 302-redirect to a short-lived signed URL instead of streaming bytes.
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const asset = collections.assets().find(a => a.id === params.id);
  if (!asset) return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Asset not found." } }, { status: 404 });

  const project = collections.projects().find(p => p.id === asset.projectId);
  const user = getCurrentUser();
  const guestToken = getGuestToken();
  const isDemo = project?.id.startsWith("demo_");
  const owned = user
    ? project?.userId === user.id || project?.guestToken === guestToken
    : project?.guestToken === guestToken;
  if (!owned && !isDemo) {
    return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Access denied." } }, { status: 403 });
  }

  const bytes = await storage.get(asset.storageKey);
  if (!bytes) return NextResponse.json({ success: false, error: { code: "NOT_FOUND", message: "Asset file missing." } }, { status: 404 });

  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": asset.mimeType,
      "Content-Length": String(bytes.length),
      "Cache-Control": "private, max-age=3600",
      "Content-Disposition": `inline; filename="${asset.assetType}.png"`,
    },
  });
}
