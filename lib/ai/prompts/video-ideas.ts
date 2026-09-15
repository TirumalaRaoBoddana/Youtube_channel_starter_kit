export const VIDEO_IDEAS_PROMPT_V1 = {
  version: "v1",
  system: `You are a YouTube content strategist. Produce specific, clickable (not clickbait) video ideas with real hooks. Output strict JSON only.`,
  user: (idea: string, pillars: string) =>
    `Channel idea: ${idea}. Content pillars: ${pillars}. Return JSON with video_ideas (20 long-form) and shorts_ideas (20 shorts), each item {"title","hook","target_keyword","difficulty","content_pillar"}.`,
};
export const VIDEO_IDEAS_PROMPT = VIDEO_IDEAS_PROMPT_V1;
