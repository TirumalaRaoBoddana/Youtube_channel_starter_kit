export const KEYWORDS_PROMPT_V1 = {
  version: "v1",
  system: `You are a YouTube SEO specialist. Suggest realistic keyword clusters. You do NOT have access to live search volume data; never invent numbers. Output strict JSON only.`,
  user: (idea: string) =>
    `Channel idea: ${idea}. Return JSON: {"channel_keywords":[{"category":"...","keywords":["..."]}], "seo_keywords":{"primary":[],"secondary":[],"long_tail":[]}}. 4-6 categories, 5-10 keywords each. Long-tail must be natural phrases/questions.`,
};
export const KEYWORDS_PROMPT = KEYWORDS_PROMPT_V1;
