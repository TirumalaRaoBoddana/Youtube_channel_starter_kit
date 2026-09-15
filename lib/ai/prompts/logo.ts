export const LOGO_PROMPT_V1 = {
  version: "v1",
  build: (brief: { brand_name: string; visual_identity: string; style: string; colors: string[]; symbols: string[]; avoid: string[] }) =>
    `Create a clean YouTube profile icon for the channel "${brief.brand_name}".
Style: ${brief.style}. Visual identity: ${brief.visual_identity}.
Brand colors: ${brief.colors.join(", ")}. Symbols to consider: ${brief.symbols.join(", ") || "simple monogram"}.
Requirements: square 1:1 composition, readable at 32px, simple bold shapes, minimal or no text, centered subject, high contrast.
Avoid: ${brief.avoid.join(", ") || "photorealism, clutter, thin lines, gradients on text"}.`,
};
export const LOGO_PROMPT = LOGO_PROMPT_V1;
