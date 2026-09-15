import { NextResponse } from "next/server";
import { requestId } from "./id";

export type ApiError = { code: string; message: string };

export function ok<T>(data: T, rid = requestId()) {
  return NextResponse.json({ success: true, data, requestId: rid });
}
export function fail(code: string, message: string, status = 400, rid = requestId()) {
  return NextResponse.json({ success: false, error: { code, message }, requestId: rid }, { status });
}
