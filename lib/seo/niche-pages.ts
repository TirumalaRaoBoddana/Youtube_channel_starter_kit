export interface NichePage {
  slug: string; label: string; h1: string; lede: string;
  exampleIdea: string;
  pillars: string[];
  paragraphs: { heading: string; body: string }[];
  faqs: { q: string; a: string }[];
}

export const NICHE_PAGES: NichePage[] = [
  {
    slug: "gaming", label: "Gaming",
    h1: "YouTube Channel Generator for Gaming Channels",
    lede: "Gaming is one of YouTube's most competitive niches — and one of the most winnable with a specific angle. Build your gaming channel's name, branding and content plan around a format you can sustain.",
    exampleIdea: "A gaming channel covering hidden mechanics and speedrun breakdowns for indie platformers",
    pillars: ["Guides & Tutorials", "Deep Dives & Lore", "Challenge Runs", "Reviews & Discoveries"],
    paragraphs: [
      { heading: "Pick a lane before you pick a name", body: "\"Gaming\" is not a niche — it's a continent. Channels that grow pick a lane: one game family, one format (guides, lore, challenges), or one audience skill level. Your generated positioning reflects the lane you describe, and every asset — from logo style (gaming favors bold, high-contrast marks) to keyword clusters — follows it." },
      { heading: "Branding that reads in a sidebar", body: "Gaming thumbnails and profile icons compete at tiny sizes next to millions of others. The generator's Gaming style direction uses dark bases with neon accents, which pop in both light and dark YouTube themes." },
    ],
    faqs: [
      { q: "What gaming formats grow fastest for new channels?", a: "Specific guides (\"how to beat X\"), challenge runs with stakes, and lore explainers for games with active communities. Broad \"let's play\" formats are hardest to grow from zero." },
      { q: "Should my channel name include the game's name?", a: "Only if you'll never cover anything else. Game-specific names cap your ceiling when you move on; format-specific names (\"...Guides\", \"...Runs\") scale better." },
    ],
  },
  {
    slug: "fitness", label: "Fitness",
    h1: "YouTube Channel Generator for Fitness Channels",
    lede: "Fitness audiences search with urgency and skepticism. Position your channel around a specific viewer — beginners, busy professionals, home-only equipment — and build branding that signals trust.",
    exampleIdea: "A fitness channel with 20-minute home workouts for people who hate gyms",
    pillars: ["Train Smart", "Eat Well", "Mindset & Habits", "Myth Busters"],
    paragraphs: [
      { heading: "Specificity is your moat", body: "\"Fitness tips\" competes with everyone. \"Home workouts for apartment dwellers with no equipment\" competes with almost nobody and converts harder. Describe your viewer precisely in the idea field — the positioning, names and video ideas all sharpen with it." },
      { heading: "Trust-first visual identity", body: "Fitness branding that overpromises (shredded silhouettes, neon hype) attracts clickbait expectations. The generator's fitness palette leans energetic-but-clean, which ages better and supports sponsorships later." },
    ],
    faqs: [
      { q: "Do fitness channels need disclaimers?", a: "Yes — include a general 'not medical advice' note in descriptions and consult local regulations for health claims. The kit's description template leaves room for it." },
      { q: "Can I run a faceless fitness channel?", a: "Yes — form-explainer animations, program breakdowns and myth-busting essays work well narrated. Demonstration-heavy formats need a visible performer." },
    ],
  },
  {
    slug: "education", label: "Education",
    h1: "YouTube Channel Generator for Education Channels",
    lede: "Educational channels win on clarity, not production budget. Generate a channel identity that promises understanding — and a content plan built from concept clusters, not random topics.",
    exampleIdea: "An education channel that explains competitive exam concepts with visual intuition",
    pillars: ["Concept Clarity", "Study Systems", "Exam Strategy", "Student Life"],
    paragraphs: [
      { heading: "Teach one idea properly", body: "The strongest education channels are known for a feeling: 'after this video, I actually get it.' That reputation comes from pillar discipline — each series owns a concept cluster and builds on the last. The generated pillars give you that skeleton from day one." },
      { heading: "Regional languages are an advantage", body: "Concept explanations in Telugu, Tamil, Hindi or Bengali face far less competition than English for the same demand. Set your language in the generator — names stay pronounceable for your audience and keywords adapt to how that audience searches." },
    ],
    faqs: [
      { q: "How long should educational videos be?", a: "As long as the concept needs — 6-12 minutes is typical for single concepts. Retention matters more than length; cut everything that doesn't build understanding." },
      { q: "Can the kit help with exam-focused channels?", a: "Yes — describe your exam and audience (e.g. \"JEE physics for Class 11\") and the strategy centers on that syllabus's concept clusters." },
    ],
  },
  {
    slug: "technology", label: "Technology",
    h1: "YouTube Channel Generator for Tech Channels",
    lede: "Tech viewers smell recycled press releases instantly. Build a channel with a real point of view — builds, honest reviews, foundations — and branding that matches a technical audience's taste.",
    exampleIdea: "A tech channel building real projects with AI coding tools and showing every mistake",
    pillars: ["Build With Me", "Tool Reviews", "CS Foundations", "Dev Career"],
    paragraphs: [
      { heading: "Show the process, keep the audience", body: "Tech content with visible struggle — failed builds, wrong turns, fixes — outperforms polished tutorials on retention because viewers stay for the resolution. The generated video ideas lean into process-driven formats for exactly this reason." },
      { heading: "A visual language for technical credibility", body: "Tech audiences read design as a signal. The generator's Tech style uses dark IDE-inspired palettes with electric accents — instantly legible as 'built by someone who ships'." },
    ],
    faqs: [
      { q: "Reviews or tutorials — which grows a new tech channel faster?", a: "Tutorials compound via search; reviews spike with product cycles. A pillar mix of both smooths the traffic curve while you build authority." },
      { q: "Do I need expensive gear to start?", a: "No. Screen recording plus a decent microphone covers most tech formats. Camera quality matters least in this niche." },
    ],
  },
  {
    slug: "cooking", label: "Cooking",
    h1: "YouTube Channel Generator for Cooking Channels",
    lede: "Food content is sensory and scheduled — people return for a style and a rhythm. Generate a channel identity with appetite, and a content plan built around weeknight reality.",
    exampleIdea: "A cooking channel with 15-minute dinners for students with one pan and a rice cooker",
    pillars: ["Weeknight Wins", "Fundamentals", "Regional Kitchen", "Budget Bites"],
    paragraphs: [
      { heading: "Cook for a constraint", body: "The channels that break through cook inside a constraint: one pan, 15 minutes, a student budget, a regional cuisine. Constraints make your value proposition memorable and your titles write themselves. Put your constraint in the idea field." },
      { heading: "Warm, honest visuals", body: "Food branding wins with warmth — rich reds, golden accents, uncluttered frames. The generator's cooking palette and banner composition keep text inside the safe area so your channel name survives every device crop." },
    ],
    faqs: [
      { q: "Do I need a fancy kitchen?", a: "No — many of the fastest-growing food channels film in small home kitchens. Relatability outperforms studio gloss in this niche." },
      { q: "Should recipes go in the description?", a: "Yes. Full recipes in descriptions drive saves, return visits and search traffic. The kit's description template is structured for it." },
    ],
  },
  {
    slug: "travel", label: "Travel",
    h1: "YouTube Channel Generator for Travel Channels",
    lede: "Travel audiences want logistics as much as vistas: costs, timing, routes. Build a channel positioned around how you travel — budget, solo, slow — not just where.",
    exampleIdea: "A travel channel covering budget solo itineraries across South India by train",
    pillars: ["Itineraries", "Budget Travel", "Hidden Gems", "Travel Skills"],
    paragraphs: [
      { heading: "Your angle is your itinerary style", body: "Everyone films sunsets. Channels grow by owning an angle: trains-only, under-₹1000/day, 48-hour city plans, off-season. Your angle determines keywords, video structure and even banner copy ('Go further for less' vs 'Luxury escapes')." },
      { heading: "Evergreen beats trendy", body: "Destination trends fade; logistics content compounds. 'How to plan a Himalayan trip on a budget' earns views for years. The generated content plan weights evergreen formats while leaving room for timely destination videos." },
    ],
    faqs: [
      { q: "Can I start a travel channel locally?", a: "Yes — regional travel (your own state or country) has strong demand and far lower competition than international content. It also keeps early production costs near zero." },
      { q: "What camera setup is enough?", a: "A modern phone plus a small gimbal and clip-on mic. Travel audiences forgive image imperfection far more than bad audio." },
    ],
  },
  {
    slug: "finance", label: "Finance",
    h1: "YouTube Channel Generator for Finance Channels",
    lede: "Finance audiences reward clarity and punish hype. Position your channel as the honest explainer — and build branding that signals trust from the first thumbnail.",
    exampleIdea: "A personal finance channel explaining investing basics for first-salary earners in India",
    pillars: ["Money Basics", "Investing 101", "Mistakes & Lessons", "Tools & Systems"],
    paragraphs: [
      { heading: "Trust is the product", body: "Finance viewers are deciding where to put real money. Channels that avoid stock-tip culture and explain mechanics calmly build audiences that stay for years. The generated positioning defaults to education-over-hype framing." },
      { heading: "Compliance-aware content planning", body: "Video ideas skew toward concepts, systems and mistake analysis — formats that inform without straying into personalized investment advice. Keep disclaimers in your description template; the kit leaves space for them." },
    ],
    faqs: [
      { q: "Do finance channels need disclaimers?", a: "Yes. Include 'educational purposes, not financial advice' in your description and consult regulations for your market before discussing specific securities." },
      { q: "Is regional-language finance content viable?", a: "Very — personal finance explanations in Hindi, Telugu, Tamil and Bengali have large demand with far fewer quality channels than English." },
    ],
  },
  {
    slug: "faceless", label: "Faceless",
    h1: "YouTube Channel Generator for Faceless Channels",
    lede: "Faceless channels trade a visible host for tighter scripting and stronger visual identity. Generate a studio-grade brand and a content plan built for narration.",
    exampleIdea: "A faceless channel telling untold business rise-and-fall stories with original graphics",
    pillars: ["Explainers", "Rankings & Comparisons", "Deep Dives"],
    paragraphs: [
      { heading: "The script is the star", body: "Without a face, structure carries retention: a promise in the first line, an open loop every 40-60 seconds, a payoff that matches the title. Generated ideas include hooks designed for exactly this rhythm." },
      { heading: "Brand recognition replaces personal recognition", body: "Faceless channels compound through visual consistency: same logo mark, same palette on every thumbnail, same watermark corner. All generated from one brand brief, so episode 50 looks like episode 1's confident older sibling." },
    ],
    faqs: [
      { q: "Are faceless channels monetizable?", a: "Yes, when content adds commentary, research or narrative value. Pure reuploads and low-effort automation content face demonetization risk — the strategy here avoids those formats." },
      { q: "What voiceover options work?", a: "Your own voice, a hired narrator, or a quality TTS voice where disclosure norms allow. Clarity and pacing matter more than which option you pick." },
    ],
  },
];

export function getNichePage(slug: string) { return NICHE_PAGES.find(n => n.slug === slug); }
