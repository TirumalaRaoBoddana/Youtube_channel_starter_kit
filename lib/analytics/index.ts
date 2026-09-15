import "server-only";
import { collections, persist } from "../db";
import { newId } from "../utils/id";

export function track(name: string, identity: { userId: string | null; guestToken: string | null }, props: Record<string, unknown> = {}) {
  collections.analyticsEvents().push({
    id: newId("ev"), name, userId: identity.userId, guestToken: identity.guestToken,
    props, at: new Date().toISOString(),
  });
  persist();
}
