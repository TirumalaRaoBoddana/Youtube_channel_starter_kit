export const DESCRIPTION_PROMPT_V1 = {
  version: "v1",
  system: `You write YouTube channel "About" descriptions that are natural, helpful and SEO-aware without keyword stuffing. Output strict JSON only.`,
  user: (idea: string, names: string, pillars: string) =>
    `Channel idea: ${idea}. Candidate name: ${names}. Content pillars: ${pillars}.
Return JSON: {"channel_description":{"short":"one line under 160 chars","seo":"120-200 words, natural, includes what viewers get and posting expectations"}}`,
};
export const DESCRIPTION_PROMPT = DESCRIPTION_PROMPT_V1;
