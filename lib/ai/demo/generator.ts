import type { ChannelAnalysis } from "../../db/types";
import { paletteFor } from "../../utils/colors";
import { detectNiche, GENERIC, type NicheProfile } from "./niches";

// Deterministic hash so the same idea always yields the same demo output.
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h);
}
function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function pick<T>(r: () => number, arr: T[]): T { return arr[Math.floor(r() * arr.length) % arr.length]; }
function shuffle<T>(r: () => number, arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function titleCase(s: string) { return s.replace(/\b\w/g, c => c.toUpperCase()); }

const ADJECTIVES = ["Clear", "Bright", "Sharp", "Daily", "Prime", "Honest", "Simple", "Curious", "Bold", "Steady", "Open", "Vivid"];

export interface DemoGenInput {
  idea: string; targetAudience?: string; language?: string; country?: string;
  contentType?: string; personality?: string;
}

export function generateDemoAnalysis(input: DemoGenInput): ChannelAnalysis {
  const seed = hash(input.idea.toLowerCase().trim());
  const r = mulberry(seed);
  const niche = detectNiche(input.idea);
  const langNote = input.language && input.language !== "English" ? ` The channel primarily speaks ${input.language}${input.country ? ` for viewers in ${input.country}` : ""}, so names stay easy to pronounce in that language while remaining brandable internationally.` : "";
  const audience = input.targetAudience?.trim() || pick(r, niche.audiencePhrases);

  // ── names ──
  const usedNouns = shuffle(r, niche.nouns);
  const names: { name: string; rationale: string }[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < niche.namePatterns.length * 2 && names.length < 14; i++) {
    const pattern = niche.namePatterns[i % niche.namePatterns.length];
    const noun = usedNouns[i % usedNouns.length];
    const adj = ADJECTIVES[(seed + i) % ADJECTIVES.length];
    const topicWord = titleCase(niche.topics[i % niche.topics.length].split(" ")[0]);
    let name = pattern.replace("{N}", noun).replace("{A}", adj).replace("{T}", topicWord);
    name = name.replace(/\s+/g, "");
    if (name.length < 4 || name.length > 24 || seen.has(name.toLowerCase())) continue;
    if (/^(\w+?)\1$/i.test(name)) continue; // skip doubled words like "WanderWander"
    seen.add(name.toLowerCase());
    names.push({ name, rationale: rationaleFor(r, name, niche, i) });
  }

  const chosenName = names[0]?.name ?? "YourChannel";
  const tagline = pick(r, niche.taglines);
  const palette = paletteFor(niche.key);
  const font = pick(r, niche.fontPairs);

  // ── keywords ──
  const base = niche.topics.slice(0, 12);
  // Circular selection: every group gets its full count even when a niche
  // profile has few topics (schema requires >= 3 keywords per group).
  const take = (start: number, count: number) =>
    Array.from({ length: count }, (_, k) => base[(start + k) % base.length]);
  const channelKeywords = [
    { category: "Core topics", keywords: take(0, 6).map(t => `${niche.label.toLowerCase()} ${t}`) },
    { category: "Beginner searches", keywords: take(0, 5).map(t => `${t} for beginners`) },
    { category: "How-to intent", keywords: take(2, 6).map(t => `how to ${t}`) },
    { category: "Related interests", keywords: take(4, 6).map(t => `best way to learn ${t}`) },
  ];
  const seoKeywords = {
    primary: [niche.label.toLowerCase(), `${niche.label.toLowerCase()} for beginners`, `learn ${niche.topics[0]}`, `best ${niche.label.toLowerCase()} channel`].slice(0, 5),
    secondary: base.slice(0, 8).map(t => `${t} explained`),
    long_tail: [
      `how to start learning ${niche.topics[0]} from scratch`,
      `${niche.topics[1]} explained simply for beginners`,
      `best way to get better at ${niche.topics[2]}`,
      `${niche.label.toLowerCase()} roadmap for ${audience.split(",")[0].trim()}`,
      `${niche.topics[3]} mistakes to avoid as a beginner`,
      `step by step ${niche.topics[4] ?? niche.topics[0]} guide`,
    ],
  };

  // ── ideas ──
  const difficulties = ["easy", "medium", "hard"];
  const makeIdea = (topic: string, i: number, short: boolean) => ({
    title: short ? shortTitle(topic, i) : longTitle(topic, i),
    hook: pick(r, niche.hooks),
    target_keyword: `${topic} ${short ? "shorts" : "for beginners"}`,
    difficulty: difficulties[(seed + i) % 3],
    content_pillar: niche.pillars[i % niche.pillars.length].name,
  });
  const shortsBase = shuffle(r, base);
  const videoIdeas = Array.from({ length: 20 }, (_, i) => makeIdea(base[i % base.length], i, false));
  const shortsIdeas = Array.from({ length: 20 }, (_, i) => makeIdea(shortsBase[i % shortsBase.length], i + 40, true));

  const positioning = `A ${input.personality ? input.personality.toLowerCase() + ", " : ""}${niche.label.toLowerCase()} channel built for ${audience}. Where most channels in this space ${pick(r, ["move too fast and assume prior knowledge", "chase trends instead of fundamentals", "explain what but never why", "overwhelm beginners with jargon"])}, this channel ${pick(r, ["slows down exactly where confusion happens", "starts every topic from real intuition", "shows the reasoning, not just the result", "turns each idea into something the viewer can use the same day"])}.${langNote}`;

  return {
    channel_positioning: positioning,
    target_audience: `${titleCase(audience)} who want clear, practical ${niche.label.toLowerCase()} content they can actually apply.`,
    content_pillars: niche.pillars.slice(0, Math.max(3, Math.min(5, niche.pillars.length))),
    channel_names: names.slice(0, 12),
    channel_description: {
      short: `${chosenName} — ${tagline} New ${niche.label.toLowerCase()} videos built for ${audience.split(",")[0].trim()}.`,
      seo: `Welcome to ${chosenName}. This channel makes ${niche.label.toLowerCase()} understandable for ${audience}. Every week we break down ${niche.topics.slice(0, 3).join(", ")} and more — with clear explanations, practical examples and zero filler.\n\nWhat you'll find here:\n• ${niche.pillars.map(p => p.name).join("\n• ")}\n\nWhether you're just starting out or sharpening skills you already have, each video is designed to teach one idea properly. Subscribe and start with our beginner playlists — they're ordered so nothing gets confusing.`,
    },
    channel_keywords: channelKeywords,
    seo_keywords: seoKeywords,
    brand_personality: `${(input.personality ?? "Friendly and clear")}. The channel feels like ${pick(r, ["a smart friend explaining things on a whiteboard", "a patient mentor who never makes you feel behind", "a curious guide who tests everything first"])}.`,
    visual_style: pick(r, niche.visualStyles),
    color_palette: [
      { name: "Primary", hex: palette[0], usage: "Logo, headings, primary buttons" },
      { name: "Secondary", hex: palette[1], usage: "Accents, highlights, end screens" },
      { name: "Accent", hex: palette[2], usage: "Callouts, arrows, emphasis" },
      { name: "Background", hex: palette[3], usage: "Thumbnails and channel background base" },
    ],
    font_recommendations: [
      { name: font.heading, usage: "Headings, thumbnails, logo lockups", fallback: font.fallback },
      { name: font.body, usage: "Descriptions, subtitles, body text", fallback: font.fallback },
    ],
    tagline,
    video_ideas: videoIdeas,
    shorts_ideas: shortsIdeas,
    niche: niche.key,
  };
}

function rationaleFor(r: () => number, name: string, niche: NicheProfile, i: number): string {
  const reasons = [
    `Short, pronounceable and instantly hints at ${niche.label.toLowerCase()} content.`,
    `Two syllables of brand + one clear topic signal — easy to remember after one hearing.`,
    `Works as a handle (@${name.toLowerCase()}) and stays readable as a small profile picture.`,
    `Feels like a media brand, not a username — room to grow beyond a single series.`,
    `Distinctive enough to search cleanly without competing with generic terms.`,
  ];
  return reasons[(i + Math.floor(r() * 2)) % reasons.length];
}

const LONG_SHAPES = [
  (t: string) => `${titleCase(t)}: The Complete Beginner's Guide`,
  (t: string) => `I Tried ${titleCase(t)} for 30 Days — Here's What Changed`,
  (t: string) => `${titleCase(t)} Explained in 10 Minutes (No Jargon)`,
  (t: string) => `5 ${titleCase(t)} Mistakes That Keep Beginners Stuck`,
  (t: string) => `The Only ${titleCase(t)} Video You Need This Year`,
  (t: string) => `${titleCase(t)}: What Nobody Tells You Before You Start`,
  (t: string) => `How to Get Good at ${titleCase(t)} (A Realistic Roadmap)`,
  (t: string) => `${titleCase(t)} vs the Hype: An Honest Look`,
];
const SHORT_SHAPES = [
  (t: string) => `${titleCase(t)} in 60 seconds`,
  (t: string) => `Stop doing this with ${titleCase(t)}`,
  (t: string) => `The ${titleCase(t)} trick pros don't share`,
  (t: string) => `POV: you finally understand ${titleCase(t)}`,
  (t: string) => `${titleCase(t)} myth, busted`,
];
function longTitle(topic: string, i: number) { return LONG_SHAPES[i % LONG_SHAPES.length](topic); }
function shortTitle(topic: string, i: number) { return SHORT_SHAPES[i % SHORT_SHAPES.length](topic); }

export { GENERIC };
