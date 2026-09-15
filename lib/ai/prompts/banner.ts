export const BANNER_PROMPT_V1 = {
  version: "v1",
  build: (brief: { brand_name: string; tagline: string; style: string; colors: string[]; uploadSchedule?: string }) =>
    `Create a YouTube channel banner (2560x1440) for "${brief.brand_name}".
Tagline: "${brief.tagline}". Style: ${brief.style}. Colors: ${brief.colors.join(", ")}.
${brief.uploadSchedule ? `Include upload schedule text: "${brief.uploadSchedule}".` : ""}
Keep the channel name, tagline and any critical elements strictly inside the central safe area (1546x425 in the middle of the canvas).
Edges should be clean extendable background only (patterns, gradients, soft shapes) because YouTube crops sides on desktop and mobile.
Avoid photorealistic faces, cluttered text, elements near canvas edges.`,
};
export const BANNER_PROMPT = BANNER_PROMPT_V1;
