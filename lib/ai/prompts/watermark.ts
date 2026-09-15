export const WATERMARK_PROMPT_V1 = {
  version: "v1",
  build: (brief: { brand_name: string; kind: "logo" | "initials" | "icon"; colors: string[] }) =>
    `Create a minimal YouTube video watermark for "${brief.brand_name}" (${brief.kind} style).
Colors: ${brief.colors.join(", ")}. Requirements: square, transparent background if supported, recognizable at 40px, extremely minimal, high contrast single mark, no taglines.`,
};
export const WATERMARK_PROMPT = WATERMARK_PROMPT_V1;
