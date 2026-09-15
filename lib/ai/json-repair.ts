import type { ZodType } from "zod";

// Extract a JSON object from a model response that may include prose or code fences.
export function extractJson(text: string): unknown {
  const cleaned = text.trim();
  const fenced = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1].trim() : cleaned;
  try { return JSON.parse(candidate); } catch { /* fall through */ }
  // Last resort: slice from first { to last }
  const first = candidate.indexOf("{");
  const last = candidate.lastIndexOf("}");
  if (first >= 0 && last > first) {
    return JSON.parse(candidate.slice(first, last + 1));
  }
  throw new Error("No JSON object found in model output");
}

export interface Validated<T> { data: T; repaired: boolean; }

// Validate structured output; attempt one automatic repair pass, then throw.
export async function validateStructured<T>(
  raw: string,
  schema: ZodType<T>,
  repair?: (broken: unknown) => Promise<string>,
): Promise<Validated<T>> {
  const parsed = extractJson(raw);
  const first = schema.safeParse(parsed);
  if (first.success) return { data: first.data, repaired: false };
  if (repair) {
    const fixedRaw = await repair(parsed);
    const second = schema.safeParse(extractJson(fixedRaw));
    if (second.success) return { data: second.data, repaired: true };
  }
  throw new StructuredOutputError(first.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).slice(0, 8).join("; "));
}

export class StructuredOutputError extends Error {
  constructor(public details: string) {
    super("AI returned a response that did not match the expected structure.");
    this.name = "StructuredOutputError";
  }
}
