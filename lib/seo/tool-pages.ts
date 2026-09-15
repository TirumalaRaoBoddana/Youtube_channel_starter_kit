import type { SeoPageData } from "@/components/seo/tool-page";

const RELATED_TOOLSET = [
  { href: "/tools/logo-generator", label: "YouTube Logo Generator" },
  { href: "/tools/banner-generator", label: "YouTube Banner Generator" },
  { href: "/tools/watermark-generator", label: "YouTube Watermark Generator" },
  { href: "/tools/keyword-generator", label: "YouTube Keyword Generator" },
  { href: "/tools/name-generator", label: "YouTube Channel Name Generator" },
  { href: "/tools/video-idea-generator", label: "YouTube Video Idea Generator" },
];

export const TOOL_PAGE_DATA: Record<string, Omit<SeoPageData, "tool">> = {
  "logo": {
    slug: "tools/logo-generator",
    h1: "YouTube Logo Generator",
    lede: "Create a clean, recognizable YouTube profile picture in seconds. Choose your style and colors — get an 800×800 PNG that stays sharp at every size.",
    sections: [
      { heading: "What makes a good YouTube logo?", paragraphs: ["Your profile picture appears next to every comment you leave, in search results, and in the corner of your videos. At those sizes, detail is your enemy. The best channel logos use one strong shape or a bold monogram, high contrast against both light and dark interfaces, and no text smaller than a thumbnail."], bullets: ["Square format — YouTube crops profile pictures to a circle", "Readable at 32×32 pixels", "One idea per logo: a monogram, a symbol, or a wordmark", "Colors that match your banner and thumbnails"] },
      { heading: "How this generator works", paragraphs: ["Enter your channel name and niche, pick a style direction (minimal, gaming, tech, educational and more), and optionally set a brand color. The generator builds a structured brand brief — not just your raw text — and renders a logo from it, so the result matches your channel's positioning rather than a generic template."] },
      { heading: "After you download", paragraphs: ["Upload the PNG in YouTube Studio under Customization → Branding → Picture. Use the same mark as your video watermark for consistency, and keep a copy in your channel kit ZIP so every future asset matches."] },
    ],
    faqs: [
      { q: "What size should a YouTube logo be?", a: "YouTube recommends at least 98×98 pixels and displays it as a circle. This generator exports 800×800 PNGs, which stay crisp on high-DPI screens and leave room for reuse on other platforms." },
      { q: "Is the generated logo free to use commercially?", a: "Yes — assets you generate are yours to use on your channel and other branding. If you use a paid AI image provider, review that provider's usage terms for their specific policy." },
      { q: "Can I match my logo to my banner?", a: "Yes. Generate a full channel kit and both assets are built from the same brand brief — identical colors, style and typography direction." },
    ],
    related: RELATED_TOOLSET.filter(r => !r.href.includes("logo-generator")),
  },
  "banner": {
    slug: "tools/banner-generator",
    h1: "YouTube Banner Generator",
    lede: "Generate a 2560×1440 YouTube banner with your channel name, tagline and brand colors — with live desktop, mobile and TV safe-area previews.",
    sections: [
      { heading: "YouTube banner size requirements (current)", paragraphs: ["YouTube's recommended upload size is 2560×1440 pixels, with a minimum width of 2048×1152. The tricky part is cropping: TVs show the full canvas, desktop shows a wide 2560×423 strip, and mobile shows roughly the central 1546×423 area. Anything important outside that central safe area disappears on phones."] },
      { heading: "Why the safe area matters", paragraphs: ["Most DIY banners fail because the channel name or schedule sits too close to an edge. This generator keeps all critical text strictly inside the central safe zone and fills the outer canvas with clean, extendable background, then shows you exactly how each device will crop the result before you download."] },
      { heading: "Design tips that survive the crop", paragraphs: [], bullets: ["Center your channel name and tagline vertically and horizontally", "Use one accent color for emphasis, not five", "Leave breathing room — banners read at a glance", "Repeat your logo's palette so the channel feels designed, not assembled"] },
    ],
    faqs: [
      { q: "What is the YouTube banner safe area?", a: "The central 1546×423 pixels are visible on all devices including mobile. This tool marks that zone with a dashed overlay and lets you preview desktop (2560×423), mobile and TV crops." },
      { q: "What file format should I upload?", a: "PNG or JPG up to 6 MB. This generator exports a 2560×1440 PNG, ready to upload in YouTube Studio → Customization → Branding → Banner image." },
      { q: "Can I add my upload schedule?", a: "Yes — in the full channel kit flow you can pass a schedule line (e.g. \"New videos every Friday\") that renders inside the safe area." },
    ],
    related: RELATED_TOOLSET.filter(r => !r.href.includes("banner-generator")),
  },
  "watermark": {
    slug: "tools/watermark-generator",
    h1: "YouTube Watermark Generator",
    lede: "Create a minimal, transparent 300×300 branding watermark — initials, icon or logo mark — that stays legible in the corner of your videos.",
    sections: [
      { heading: "What is a YouTube video watermark?", paragraphs: ["The branding watermark is a small image pinned to the corner of your videos (YouTube Studio → Customization → Branding → Branding watermark). Viewers can hover or tap it to subscribe. YouTube recommends at least 150×150 pixels; this tool exports 300×300 so it stays crisp on high-resolution playback."] },
      { heading: "Keep it tiny on purpose", paragraphs: ["The watermark renders small and over moving video, so anything detailed turns to mush. Initials or a single symbol with strong contrast works best. Avoid taglines, gradients with subtle steps, and thin strokes."] },
      { heading: "Three styles, one brand", paragraphs: ["Choose initials (fastest to recognize), an icon mark (works without text), or your logo mark (most consistent if your logo is already simple). All three are generated from the same brand colors so your watermark never clashes with your channel art."] },
    ],
    faqs: [
      { q: "Does the watermark have a transparent background?", a: "Yes — exports are PNGs with transparency preserved, so only the mark itself appears over your video." },
      { q: "How big should the watermark file be?", a: "YouTube's minimum is 150×150 pixels. This tool exports 300×300 PNGs, comfortably above the minimum for retina playback." },
      { q: "Where does the watermark appear?", a: "Bottom-right by default on desktop playback, and viewers can tap it on mobile to subscribe. Set it to show for the entire video in YouTube Studio." },
    ],
    related: RELATED_TOOLSET.filter(r => !r.href.includes("watermark-generator")),
  },
  "keyword": {
    slug: "tools/keyword-generator",
    h1: "YouTube Keyword Generator",
    lede: "Get organized channel keywords and SEO phrases for your niche: core topics, beginner searches, how-to intent and long-tail phrases — clearly labelled as AI suggestions.",
    sections: [
      { heading: "What are channel keywords for?", paragraphs: ["Channel keywords in YouTube Studio tell the algorithm what your channel is about overall, while per-video tags and descriptions carry specific intent. Good keyword sets cover three layers: what your channel is (core topics), how people search when starting out (beginner phrases), and the specific questions your videos answer (long-tail)."] },
      { heading: "AI suggestions vs verified search data", paragraphs: ["This tool generates keyword ideas from your niche description. They are suggestions grounded in how people typically phrase searches — but they are not live search-volume data, and we never present them as such. For volume and competition numbers, pair these suggestions with a dedicated keyword research tool before committing to a content calendar."] },
      { heading: "How to use the output", paragraphs: [], bullets: ["Add 8-12 core keywords in YouTube Studio → Settings → Channel → Keywords", "Use long-tail phrases as video titles and description openers", "Group keywords by content pillar so each series targets a cluster", "Revisit quarterly — search language shifts with trends"] },
    ],
    faqs: [
      { q: "Are these keywords guaranteed to have search volume?", a: "No. They are AI-generated suggestions. We deliberately separate AI suggestions from verified search data — use a keyword research tool for volume validation." },
      { q: "How many channel keywords should I set?", a: "Roughly 10-15 mixed core and long-tail phrases is a common starting point. Quality and relevance matter more than count." },
      { q: "Do keywords work for non-English channels?", a: "Yes — select your language and the suggestions adapt to how that audience phrases searches." },
    ],
    related: RELATED_TOOLSET.filter(r => !r.href.includes("keyword-generator")),
  },
  "name": {
    slug: "tools/name-generator",
    h1: "YouTube Channel Name Generator",
    lede: "Generate memorable, brandable channel names with the reasoning behind each one — pronounceable, searchable, and free of spammy patterns.",
    sections: [
      { heading: "What makes a channel name work", paragraphs: ["A strong YouTube name is easy to say out loud, easy to spell after hearing it once, and distinctive enough to own in search. It should hint at your niche without boxing you into a single format — \"The Math of AI\" can grow; \"AI News Daily 24/7\" can't."] },
      { heading: "Patterns we avoid", paragraphs: ["Generic two-word combos (\"Tech Hub\"), number spam (\"Top10Pro\"), and keyword stuffing (\"Best AI ML Coding Channel\"). Every suggestion comes with a short rationale so you can judge the reasoning, not just the ring."] },
      { heading: "Before you commit", paragraphs: [], bullets: ["Search the name on YouTube — check for established channels with the same name", "Check the @handle availability in YouTube Studio", "Say it out loud: \"Welcome back to ___\" — does it feel natural?", "Make sure the domain and social handles are gettable, even if you don't need them today"] },
    ],
    faqs: [
      { q: "How many name options do I get?", a: "10-20 options per generation, each with a rationale explaining why it works." },
      { q: "Can I generate names in a specific language style?", a: "Yes — describe your language and audience in the niche field (e.g. \"Telugu cooking channel for hostellers\") and names stay pronounceable for that audience." },
      { q: "What if I don't like any of them?", a: "Regenerate — results vary with phrasing. Adding one more specific detail to your description usually improves the batch significantly." },
    ],
    related: RELATED_TOOLSET.filter(r => !r.href.includes("name-generator")),
  },
  "video-idea": {
    slug: "tools/video-idea-generator",
    h1: "YouTube Video Idea Generator",
    lede: "Get 20 long-form video ideas and 20 Shorts ideas for your niche — each with a hook, target keyword and difficulty rating.",
    sections: [
      { heading: "Ideas with hooks, not just titles", paragraphs: ["A title gets the click; a hook keeps the first 30 seconds. Every idea from this generator includes the opening angle — the tension, promise or curiosity gap your intro should establish — plus the keyword the video targets and a realistic difficulty rating for a new channel."] },
      { heading: "Long-form vs Shorts strategy", paragraphs: ["Long-form ideas build authority and watch time; Shorts ideas build discovery. The generator keeps them in the same niche but adapts the framing: Shorts titles are punchier and built around a single moment or myth, while long-form titles promise a complete payoff."] },
      { heading: "Turn ideas into a calendar", paragraphs: ["Pick one idea per content pillar for your first ten videos. That guarantees variety for the algorithm and viewers while you learn what resonates — then double down on the pillars that perform."] },
    ],
    faqs: [
      { q: "How many ideas do I get per generation?", a: "20 long-form ideas and 20 Shorts ideas, each with hook, target keyword and difficulty." },
      { q: "Are the ideas unique to my niche?", a: "Yes — ideas are generated from your specific topic description, not a static list. Add detail (audience, format, language) for sharper results." },
      { q: "Can I use these ideas commercially?", a: "Yes. Ideas are starting points for your own original scripts and production." },
    ],
    related: RELATED_TOOLSET.filter(r => !r.href.includes("video-idea-generator")),
  },
};
