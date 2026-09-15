export const CHANNEL_NAMES_PROMPT_V1 = {
  version: "v1",
  system: `You are a brand naming expert for YouTube channels. Generate unique-feeling, memorable, pronounceable names that clearly relate to the niche. No spammy patterns, no generic words alone. Output strict JSON only.`,
  user: (niche: string, personality?: string) =>
    `Generate 12-16 YouTube channel name options for a channel about: ${niche}.${personality ? ` Personality: ${personality}.` : ""} Return JSON: {"channel_names":[{"name":"...","rationale":"..."}]}`,
};
export const CHANNEL_NAMES_PROMPT = CHANNEL_NAMES_PROMPT_V1;
