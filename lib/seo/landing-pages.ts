import type { SeoPageData } from "@/components/seo/tool-page";

const CORE = [
  { href: "/tools/logo-generator", label: "Logo Generator" },
  { href: "/tools/banner-generator", label: "Banner Generator" },
  { href: "/tools/keyword-generator", label: "Keyword Generator" },
  { href: "/tools/name-generator", label: "Name Generator" },
  { href: "/tools/video-idea-generator", label: "Video Idea Generator" },
  { href: "/faceless-youtube-channel-generator", label: "Faceless Channel Guide" },
];

export const SEO_PAGES: Record<string, Omit<SeoPageData, "tool">> = {
  "ai-youtube-channel-generator": {
    slug: "ai-youtube-channel-generator",
    h1: "AI YouTube Channel Generator",
    lede: "Describe your channel idea in one sentence. Get a complete launch kit: positioning, names, description, keywords, content pillars, branding and 40 video ideas.",
    sections: [
      { heading: "The real bottleneck isn't filming", paragraphs: ["Most new channels stall before they start: no clear positioning, a forgettable name, inconsistent branding and no idea what to post after video three. This generator attacks that exact gap — it turns a raw idea into the strategy documents and brand assets that normally take weeks of scattered tools."] },
      { heading: "What one generation produces", paragraphs: [], bullets: ["10-20 channel name options with rationale", "Channel positioning and target audience statement", "3-7 content pillars with descriptions", "Short + SEO channel descriptions", "Organized keyword sets (AI-suggested, clearly labelled)", "20 long-form and 20 Shorts ideas with hooks", "Logo, 2560×1440 banner and watermark", "Brand colors and typography pairing"] },
      { heading: "Why one workflow beats ten tools", paragraphs: ["Separate generators produce separate universes: a name from one tool, colors from another, keywords from a third. Here everything derives from a single structured analysis of your idea, so your banner matches your logo, your keywords match your pillars, and your channel reads as one brand from day one."] },
      { heading: "Guest-friendly by design", paragraphs: ["Your first generation needs no account. See the full result, then decide — if it's useful, a free account saves it and unlocks higher daily limits."] },
    ],
    faqs: [
      { q: "Is this really free?", a: "Yes. Guests get daily free generations and signed-in free accounts get 10 text and 2 image generations per day, including the full channel kit download." },
      { q: "Which AI does it use?", a: "The platform is provider-agnostic. It uses the configured text and image providers, and a built-in offline engine keeps everything working when no API keys are set." },
      { q: "Can I edit the results?", a: "You can regenerate any single element (logo, banner, watermark) without redoing the project, edit brand name and tagline, and download everything individually or as one ZIP." },
    ],
    related: CORE,
  },
  "youtube-logo-generator": {
    slug: "youtube-logo-generator",
    h1: "YouTube Logo Generator: Profile Pictures That Read at Any Size",
    lede: "Your profile picture is your channel's handshake — it appears in search, comments and subscriptions at sizes as small as 24 pixels. Generate one that survives.",
    sections: [
      { heading: "Circle-crop reality", paragraphs: ["YouTube renders profile pictures as circles. Square art with corner elements loses them; wide wordmarks get chopped. Design for a centered square whose important content lives in the middle 80% — that is exactly the constraint this generator applies."] },
      { heading: "Style directions, not templates", paragraphs: ["Choose from twelve style directions — minimal, modern, 3D, flat, gaming, educational, luxury, tech, cartoon, mascot, typography, abstract. Each produces a different composition language rather than the same shape with a new color."] },
      { heading: "Consistency checklist", paragraphs: [], bullets: ["Same palette across logo, banner, watermark and thumbnails", "One recognizable mark — reuse it everywhere", "Test at 32px before you commit", "Keep a master PNG (800×800) for reuse on podcasts, socials and merch"] },
    ],
    faqs: [
      { q: "What file do I upload to YouTube?", a: "A square PNG or JPG, at least 98×98 px. This tool exports 800×800 PNGs which is comfortably above the minimum." },
      { q: "Should my logo include my channel name?", a: "Usually no. Full names become unreadable at small sizes. A monogram (initials) or symbol plus the name in your banner works better." },
      { q: "Can I regenerate until I like it?", a: "Yes, within your daily image generation limit. Free accounts get 2 image generations per day; Pro gets 40." },
    ],
    related: CORE,
  },
  "youtube-banner-generator": {
    slug: "youtube-banner-generator",
    h1: "YouTube Banner Generator With Real Safe-Area Previews",
    lede: "Banners fail quietly: they look great on your monitor and crop to nothing on phones. Generate a 2560×1440 banner and preview every device crop before uploading.",
    sections: [
      { heading: "One image, three crops", paragraphs: ["TV shows the full 2560×1440. Desktop shows a 2560×423 letterbox. Mobile shows roughly the central 1546×423. A banner that only works in one of those views is broken in the other two — which is why this tool ships with a device switcher and safe-area overlay instead of a flat preview."] },
      { heading: "What belongs in the safe area", paragraphs: [], bullets: ["Channel name", "Tagline (one line, max ~6 words)", "Optional upload schedule", "Nothing else — the edges are background territory"] },
      { heading: "The extendable-edge principle", paragraphs: ["Because side crops vary, the outer canvas should be pure extendable background: gradients, soft shapes, texture. The generator follows this rule automatically, so your name never ends up half-visible on a phone."] },
    ],
    faqs: [
      { q: "What size does YouTube want?", a: "2560×1440 recommended upload (minimum 2048×1152), max file size 6 MB. This tool exports exactly 2560×1440 PNG." },
      { q: "What is the mobile safe area?", a: "Approximately the central 1546×423 pixels. Keep all text and logos inside it and every device shows your full message." },
      { q: "Can I include my upload schedule?", a: "Yes — add it in the full channel kit flow and it renders inside the safe area in your accent color." },
    ],
    related: CORE,
  },
  "youtube-watermark-generator": {
    slug: "youtube-watermark-generator",
    h1: "YouTube Watermark Generator",
    lede: "The subscribe watermark is the most-clicked-per-pixel asset on your channel. Generate a transparent 300×300 mark that stays legible over any footage.",
    sections: [
      { heading: "Small asset, real job", paragraphs: ["The branding watermark sits in the bottom corner of every video. On desktop, hovering it surfaces a subscribe button. It needs to work over bright vlogs and dark gaming footage alike — which means high contrast, zero detail, and transparency."] },
      { heading: "Pick your mark", paragraphs: [], bullets: ["Initials — fastest recognition for personality channels", "Icon — a single symbol, ideal for faceless and brand channels", "Logo mark — reuse your profile icon if it's already simple"] },
      { heading: "Setup in YouTube Studio", paragraphs: ["YouTube Studio → Customization → Branding → Branding watermark. Upload the PNG and set display time to \"Entire video\" so the subscribe affordance is always available."] },
    ],
    faqs: [
      { q: "Minimum size for the watermark?", a: "150×150 pixels. This tool exports 300×300 PNGs with transparency preserved." },
      { q: "Does it show on mobile?", a: "On mobile playback viewers can tap the watermark area to subscribe; it is most prominent on desktop playback." },
      { q: "Should the watermark match my logo?", a: "If your logo is already a simple mark, reuse it. If your logo is detailed, generate a simplified initials or icon variant instead." },
    ],
    related: CORE,
  },
  "youtube-keyword-generator": {
    slug: "youtube-keyword-generator",
    h1: "YouTube Keyword Generator for Channels and Videos",
    lede: "Build a keyword architecture for your channel: core topics, beginner phrases, how-to intent and long-tail questions — organized by category, honestly labelled.",
    sections: [
      { heading: "Channel keywords vs video keywords", paragraphs: ["Channel keywords set the overall context for your channel in YouTube Studio. Video-level keywords (title, description, tags) carry the specific intent of each upload. A coherent channel maps video keywords upward into clusters that match its channel keywords — that structure is what this tool outputs."] },
      { heading: "The honesty policy", paragraphs: ["Free keyword tools that promise exact search volumes are usually guessing. This generator gives you well-structured suggestions and says so plainly: they are AI suggestions, not verified data. Validate the shortlist you actually build content around with a dedicated research tool."] },
      { heading: "A practical workflow", paragraphs: [], bullets: ["Generate keywords for your niche", "Group them under your 3-7 content pillars", "Turn each long-tail phrase into a video title candidate", "Set 10-15 core phrases as channel keywords in Studio", "Review performance in YouTube Analytics search terms monthly"] },
    ],
    faqs: [
      { q: "Do you show search volume?", a: "No. We show AI-suggested keywords and clearly distinguish them from verified search data, which requires an external research provider." },
      { q: "How many keywords should a new channel set?", a: "Start with 10-15 relevant channel keywords. Irrelevant keywords can mislead the algorithm more than missing ones help." },
      { q: "Does it support non-English channels?", a: "Yes — choose your language and suggestions follow how that audience phrases searches." },
    ],
    related: CORE,
  },
  "youtube-channel-name-generator": {
    slug: "youtube-channel-name-generator",
    h1: "YouTube Channel Name Generator With Reasoning",
    lede: "Names are forever-ish. Generate brandable options with the reasoning behind each, then validate with our checklist before you commit.",
    sections: [
      { heading: "Memorable beats clever", paragraphs: ["The best channel names are easy to pronounce, easy to spell from memory, and pass the \"welcome back to ___\" test. Clever puns that need explaining fail the second criterion and die in word-of-mouth."] },
      { heading: "Every suggestion ships with rationale", paragraphs: ["Unlike name spinners, each option explains why it works — syllable structure, search distinctiveness, handle availability intuition. You are choosing with reasoning, not vibes."] },
      { heading: "The 5-minute validation checklist", paragraphs: [], bullets: ["YouTube search: no established channel already owns it", "@handle: available in YouTube Studio", "Say it aloud twice — no tongue-twisters", "Imagine it on a thumbnail lower-third — does it fit?", "Domain + social handles: at least obtainable"] },
    ],
    faqs: [
      { q: "How many names per generation?", a: "10-20 options, each with rationale. Regeneration produces a fresh batch influenced by how specific your description is." },
      { q: "Can I rename my channel later?", a: "Yes, YouTube allows renames, but you lose name recognition and search history. Worth validating early." },
      { q: "Do names support regional languages?", a: "Yes — mention your language (e.g. \"Tamil tech reviews\") and names stay pronounceable and brandable for that audience." },
    ],
    related: CORE,
  },
  "youtube-video-idea-generator": {
    slug: "youtube-video-idea-generator",
    h1: "YouTube Video Idea Generator: 40 Ideas With Hooks",
    lede: "Long-form and Shorts ideas for your niche, each with an opening hook, target keyword and difficulty rating — enough for your first two months of uploads.",
    sections: [
      { heading: "Why hooks matter more than titles", paragraphs: ["YouTube's retention graph is decided in the first 30 seconds. Every idea here includes the hook — the promise, tension or curiosity gap your intro must establish — so you are not just collecting titles, you are collecting openers."] },
      { heading: "Difficulty ratings for new channels", paragraphs: ["Each idea is rated easy, medium or hard based on production demands for a beginner. Start with easy wins that teach your workflow, then attempt the hard formats once editing feels routine."] },
      { heading: "From list to calendar", paragraphs: ["Pick one idea per content pillar for your first ten uploads. This balances the algorithm's view of your channel with viewer variety, and tells you quickly which pillar deserves more episodes."] },
    ],
    faqs: [
      { q: "How many ideas per generation?", a: "20 long-form ideas and 20 Shorts ideas with hooks, keywords and difficulty." },
      { q: "Are ideas niche-specific?", a: "Yes — generated from your description, not a static database. Specificity in, specificity out." },
      { q: "Can I combine this with the full kit?", a: "The full channel kit includes these same ideas plus pillars, keywords and branding derived from the same analysis." },
    ],
    related: CORE,
  },
  "faceless-youtube-channel-generator": {
    slug: "faceless-youtube-channel-generator",
    h1: "Faceless YouTube Channel Generator",
    lede: "Launch a faceless channel with script-first strategy: explainer positioning, voiceover-friendly branding, and video ideas built for narration — no camera required.",
    sections: [
      { heading: "Faceless channels live or die on structure", paragraphs: ["Without a face to carry attention, the script carries everything: a clear promise in the first line, steady information density, and pattern interrupts every 40-60 seconds. This generator positions faceless channels around explainer, ranking and deep-dive formats where narration is a feature, not a limitation."] },
      { heading: "Branding that substitutes for a personality", paragraphs: ["Faceless channels need stronger visual identity: a distinctive logo mark, consistent color language on thumbnails, and a watermark that builds recognition episode after episode. All three are generated from one brand brief so the channel reads as a studio, not a slideshow."] },
      { heading: "Formats that work without a face", paragraphs: [], bullets: ["Narrated explainers with original graphics", "Well-researched rankings with real reasoning", "Single-story mini documentaries", "Timeline reconstructions and case studies"] },
      { heading: "Avoiding the low-effort trap", paragraphs: ["\"Cash cow\" content that is pure stock footage over AI voiceover is increasingly demonetized and audience-rejected. The strategy here targets commentary and research value — the sustainable version of faceless."] },
    ],
    faqs: [
      { q: "Do I need to show my face later?", a: "No. The positioning, branding and formats are designed to work with voiceover only. Many channels never reveal a host." },
      { q: "What niche works best for faceless channels?", a: "Explainer-heavy niches: history, business case studies, science, finance, tech explainers, mysteries. Personality-driven niches (vlogs, reaction) work less well." },
      { q: "Does the kit include scripts?", a: "It includes ideas with hooks and target keywords — the skeleton of each script. Writing the full script stays your craft (and keeps monetization safe)." },
    ],
    related: CORE,
  },
};
