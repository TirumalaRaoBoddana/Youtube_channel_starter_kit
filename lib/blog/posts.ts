// Blog stored as structured blocks (no MDX runtime dependency).
// Add new posts by appending here — architecture is CMS-swappable.
export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export interface BlogPost {
  slug: string; title: string; description: string; date: string; readingMinutes: number;
  body: Block[];
}

export const POSTS: BlogPost[] = [
  {
    slug: "how-to-start-a-youtube-channel",
    title: "How to Start a YouTube Channel: A Realistic First-30-Days Plan",
    description: "A practical, hype-free plan for your first month on YouTube: positioning, branding, your first five videos, and the settings most beginners skip.",
    date: "2026-08-18", readingMinutes: 9,
    body: [
      { type: "p", text: "Most 'start a YouTube channel' advice jumps straight to cameras and editing software. That's backwards. The channels that survive month three are the ones that answered three questions before uploading anything: who is this for, what do they get, and why would they come back. Here's a realistic first-30-days plan built around those answers." },
      { type: "h2", text: "Week 1: Position before you produce" },
      { type: "p", text: "Write one sentence: 'My channel helps [audience] get [outcome] through [format].' If any bracket is empty, keep iterating — this sentence will decide your name, your banner copy and your first ten titles. Channels that skip this step end up as 'a bit of everything', which the algorithm can't route and viewers can't recommend." },
      { type: "ul", items: ["Pick one audience you could describe to a stranger in five words", "Pick one outcome — the thing viewers can do after watching that they couldn't before", "Pick one repeatable format — the shape every episode follows"] },
      { type: "h2", text: "Week 2: Brand the channel in one sitting" },
      { type: "p", text: "You need exactly five assets: a name, a profile picture, a banner, a watermark, and a channel description with keywords. This is a two-hour job with the right tools, not a two-week design project. The complete channel kit flow generates all five from your positioning sentence — but the important part is that they all come from the same source, so they match." },
      { type: "p", text: "One technical detail most guides skip: your banner's critical text must sit inside the central 1546×423 safe area, because mobile crops everything outside it. Preview your banner on all three device crops before uploading." },
      { type: "h2", text: "Week 3: Plan ten videos, film two" },
      { type: "p", text: "Plan ten, not one. A list of ten titles exposes whether your format is actually repeatable. Then film only two — your first video will be your worst, and you want the gap between video one and video two to be days, not months. Open every video with the payoff in the first fifteen seconds; intros with channel logos are a retention killer in 2026." },
      { type: "h2", text: "Week 4: Upload, then set the boring settings" },
      { type: "ul", items: ["Channel keywords (Settings → Channel): 10-15 phrases describing your lane", "Upload defaults: description template with your links and disclaimer", "Branding watermark: show for entire video", "End screens: point to your best video, not your newest"] },
      { type: "p", text: "Then commit to a schedule you can survive — one video a week beats three in a week followed by silence. The algorithm rewards consistency that viewers can plan around, and so do viewers." },
    ],
  },
  {
    slug: "how-to-choose-a-youtube-channel-name",
    title: "How to Choose a YouTube Channel Name (That You Won't Hate in a Year)",
    description: "A practical framework for naming your channel: the four tests every name should pass, the patterns to avoid, and how to validate before committing.",
    date: "2026-08-04", readingMinutes: 7,
    body: [
      { type: "p", text: "Your channel name is the one branding decision that's expensive to reverse. Renames are technically allowed, but you lose search recognition, word-of-mouth continuity and every 'oh I know that channel' moment you've built. Choose like it's forever, because it mostly is." },
      { type: "h2", text: "The four tests" },
      { type: "ul", items: ["The bar test: say it in a noisy room. Can someone spell it later from memory alone?", "The welcome test: 'Welcome back to ___' — does it feel natural spoken aloud, every week, for years?", "The ceiling test: does it lock you into one game, one format, or one version of yourself? 'FortniteKing' ages badly; 'BuildsAndBosses' grows with you.", "The search test: search it on YouTube. If an established channel owns it, pick something else — you'll be their typo traffic forever."] },
      { type: "h2", text: "Patterns that date you" },
      { type: "p", text: "Number spam ('Top10Pro'), era markers ('...2026'), platform hedges ('...YT'), and keyword stuffing ('Best AI ML Coding Channel') all signal 'created by someone chasing an algorithm.' They also age terribly. Two clean words with a rhythm — The Math of AI, Atlas & Ember, Proof and Pixel — outlast every trend." },
      { type: "h2", text: "Validate in five minutes" },
      { type: "p", text: "Before committing: check the @handle in YouTube Studio, search the name on YouTube and Google, and confirm the domain and social handles are at least obtainable. Then generate a batch of options with rationale, shortlist three, and sleep on it. The one you still like in the morning is your name." },
    ],
  },
  {
    slug: "youtube-banner-size-guide",
    title: "YouTube Banner Size Guide: Dimensions, Safe Areas and Device Crops",
    description: "Every current YouTube banner dimension in one place: 2560×1440 upload size, the 1546×423 safe area, and exactly how desktop, mobile and TV crop your art.",
    date: "2026-07-22", readingMinutes: 6,
    body: [
      { type: "p", text: "YouTube banners confuse new creators because one file must survive three completely different crops. Get it wrong and your channel name exists only on TVs — which is not where your audience is. Here's the full picture." },
      { type: "h2", text: "The numbers that matter" },
      { type: "ul", items: ["Recommended upload: 2560 × 1440 px (minimum 2048 × 1152, max file 6 MB)", "Safe area for text and logos: central 1546 × 423 px", "TV display: the full 2560 × 1440", "Desktop display: 2560 × 423 — a wide letterbox strip", "Mobile display: roughly the central 1546 × 423"] },
      { type: "h2", text: "Design rules that follow from the crops" },
      { type: "p", text: "Everything critical — name, tagline, schedule — goes inside the central safe zone, vertically centered. The outer canvas should be pure extendable background: gradients, soft shapes, texture. Never place text within ~500px of the left or right edges; on desktop it may survive, on mobile it's gone." },
      { type: "h2", text: "The 30-second QA routine" },
      { type: "p", text: "Before uploading, view your banner at three crops: full canvas, a 2560×423 strip through the middle, and the central 1546×423 box. Our banner generator has these previews built in, but the habit matters more than the tool. If your message reads in all three, ship it." },
    ],
  },
  {
    slug: "best-youtube-niches-for-beginners",
    title: "Best YouTube Niches for Beginners: Picking a Lane You Can Actually Sustain",
    description: "How to choose a YouTube niche by the three filters that predict survival — demand, competition gap and your sustainability — with realistic beginner-friendly examples.",
    date: "2026-07-08", readingMinutes: 8,
    body: [
      { type: "p", text: "'Best niche' lists rank by CPM — how much advertisers pay per view. That's useful information and terrible advice for a beginner, because the highest-CPM niches (finance, business software) are also the most credibility-gated. A beginner's best niche is one they can publish in weekly for a year without burning out. Here's a better framework." },
      { type: "h2", text: "Filter 1: Demand you can verify in five minutes" },
      { type: "p", text: "Search your topic on YouTube. If results are mostly big channels with millions of subscribers, the demand exists but the gap is closed. If you see small channels (<10k subs) with videos outperforming their size, there's an opening — the algorithm is already surfacing small creators for those queries." },
      { type: "h2", text: "Filter 2: A constraint only you have" },
      { type: "p", text: "Sustainable niches usually contain a constraint that's true about you: your language, your region, your profession, your situation. 'Personal finance' is saturated; 'personal finance for first-salary earners in tier-2 Indian cities' is not. Constraints shrink your audience and multiply your conversion from viewer to subscriber." },
      { type: "h2", text: "Filter 3: The one-year test" },
      { type: "p", text: "Could you make video #40 in this niche without dreading it? Niches chosen purely for CPM fail this test constantly. If the topic bores you slightly now, it will exhaust you by month three — and an exhausted channel posts nothing, which earns exactly zero CPM." },
      { type: "h2", text: "Beginner-friendly lanes, honestly rated" },
      { type: "ul", items: ["Education in a regional language — huge demand, low competition, high trust", "Faceless explainers (history, business cases, science) — script-forward, camera-free", "Constraint-based cooking (one pan, student budget) — evergreen and shareable", "Local travel logistics — costs, routes, timing — compounding search traffic", "Specific gaming lanes (one game family, one format) — passionate built-in communities"] },
      { type: "p", text: "Whatever you pick, write the positioning sentence first — 'My channel helps [audience] get [outcome] through [format]' — and let a full generation test whether the niche holds together: names, pillars and 40 video ideas will expose a weak lane immediately." },
    ],
  },
];

export function getPost(slug: string) { return POSTS.find(p => p.slug === slug); }
