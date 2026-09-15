import { randomBytes } from "crypto";
export function newId(prefix: string): string {
  return `${prefix}_${randomBytes(10).toString("hex")}`;
}
export function requestId(): string {
  return `req_${randomBytes(8).toString("hex")}`;
}
