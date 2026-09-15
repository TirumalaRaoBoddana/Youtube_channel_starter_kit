// Niche knowledge base for the demo text engine. Each profile contains real,
// niche-specific vocabulary so output never collapses into generic filler.
export interface NicheProfile {
  key: string;
  label: string;
  match: string[];
  topics: string[];          // used to build pillars & keywords
  pillars: { name: string; description: string }[];
  namePatterns: string[];    // {A}=adjective-ish, {T}=topic word, {N}=niche noun
  nouns: string[];
  hooks: string[];
  audiencePhrases: string[];
  visualStyles: string[];
  fontPairs: { heading: string; body: string; fallback: string }[];
  taglines: string[];
}

export const NICHES: NicheProfile[] = [
  {
    key: "ai-math", label: "AI & Mathematics",
    match: ["ai", "artificial intelligence", "machine learning", "math", "maths", "mathematics", "llm", "neural", "data science", "statistics"],
    topics: ["neural network fundamentals", "linear algebra for ML", "how LLMs actually work", "probability & statistics", "gradient descent explained", "transformers from scratch", "AI tools for students", "calculus for machine learning", "prompt engineering", "AI project walkthroughs", "math intuition visualizations", "AI career paths"],
    pillars: [
      { name: "AI Fundamentals", description: "Core concepts of machine learning explained visually, from neurons to transformers." },
      { name: "Mathematics Intuition", description: "The linear algebra, calculus and probability behind the algorithms — no proof walls." },
      { name: "Hands-On Projects", description: "Build small AI projects end to end, from dataset to deployed demo." },
      { name: "LLMs & Prompting", description: "How large language models work and how to use them well." },
      { name: "AI Career & Study Paths", description: "Roadmaps, tools and habits for students entering AI." },
    ],
    namePatterns: ["{T}Explained", "The{A}{N}", "{T}WithClarity", "ProofAnd{N}", "{N}Intuition", "Neural{N}", "{A}{N}Lab", "ZeroTo{N}"],
    nouns: ["Neuron", "Tensor", "Sigma", "Gradient", "Vector", "Matrix", "Logic", "Cortex"],
    hooks: [
      "Everyone uses this equation — almost nobody can explain why it works.",
      "This 8-minute visual will change how you see neural networks forever.",
      "Your textbook buries this idea on page 200. It's actually the whole game.",
      "I tried learning this the hard way so you don't have to.",
      "One picture is worth ten lectures here.",
    ],
    audiencePhrases: ["students meeting AI for the first time", "self-taught programmers", "curious beginners who hate jargon", "career switchers"],
    visualStyles: ["clean and technical with generous whitespace", "chalkboard-meets-modern minimalism", "crisp diagrams on near-white backgrounds"],
    fontPairs: [{ heading: "Space Grotesk", body: "Inter", fallback: "Arial, sans-serif" }, { heading: "Sora", body: "Source Sans 3", fallback: "Helvetica, sans-serif" }],
    taglines: ["Hard ideas, drawn simply.", "AI and math, minus the mystery.", "Understand it, don't memorize it."],
  },
  {
    key: "gaming", label: "Gaming",
    match: ["gaming", "game", "gameplay", "minecraft", "fortnite", "fps", "rpg", "speedrun", "esports", "playthrough"],
    topics: ["beginner guides", "tier lists", "hidden mechanics", "speedrun breakdowns", "patch reviews", "lore deep dives", "setup & sensitivity tips", "challenge runs", "indie game discoveries", "pro player analysis"],
    pillars: [
      { name: "Guides & Tutorials", description: "Clear, no-fluff guides that take players from confused to confident." },
      { name: "Deep Dives & Lore", description: "Stories, mechanics and secrets hiding in plain sight." },
      { name: "Challenge Runs", description: "Self-imposed challenges with real stakes and real reactions." },
      { name: "Reviews & Discoveries", description: "Honest takes on new releases and underrated indie gems." },
    ],
    namePatterns: ["{T}{N}", "{N}Vault", "Pixel{N}", "{A}{N}Plays", "{N}Central", "Frame{N}", "{N}Arcade"],
    nouns: ["Frame", "Pixel", "Respawn", "Combo", "Loot", "Quest", "Boss", "Meta"],
    hooks: [
      "I played 100 hours so this guide takes you 10 minutes.",
      "This mechanic has been in front of everyone since launch.",
      "Nobody does this run the way it's actually meant to be done.",
      "The patch notes buried the biggest change of the year.",
    ],
    audiencePhrases: ["new players overwhelmed by mechanics", "competitive grinders", "casual players who want the good stuff fast"],
    visualStyles: ["bold neon-on-dark energy", "high contrast with punchy accents", "arcade-inspired graphics"],
    fontPairs: [{ heading: "Chakra Petch", body: "Inter", fallback: "Arial, sans-serif" }, { heading: "Rajdhani", body: "Roboto", fallback: "Helvetica, sans-serif" }],
    taglines: ["Play smarter, not longer.", "Every frame has a story.", "Level up, one video at a time."],
  },
  {
    key: "fitness", label: "Fitness & Health",
    match: ["fitness", "gym", "workout", "health", "weight loss", "yoga", "nutrition", "muscle", "running", "wellness"],
    topics: ["beginner workout plans", "form corrections", "home workouts without equipment", "nutrition basics", "mobility routines", "habit building", "myth busting", "progress tracking"],
    pillars: [
      { name: "Train Smart", description: "Workout plans and form guides that respect beginner bodies." },
      { name: "Eat Well", description: "Nutrition without dogma — practical, affordable, sustainable." },
      { name: "Mindset & Habits", description: "The boring-but-decisive stuff: consistency, sleep, motivation." },
      { name: "Myth Busters", description: "Testing viral fitness claims against real evidence." },
    ],
    namePatterns: ["{A}{N}Fit", "The{N}Method", "{N}Strong", "Daily{N}", "{T}Club", "Fit{N}"],
    nouns: ["Rep", "Form", "Pulse", "Core", "Stride", "Balance", "Gain", "Habit"],
    hooks: [
      "I made every beginner mistake so this plan avoids all of them.",
      "This one form fix ended my two-year plateau.",
      "Everything viral told you about this exercise is backwards.",
      "20 minutes, no equipment, actually progressive.",
    ],
    audiencePhrases: ["complete beginners intimidated by gyms", "busy people with 30 minutes a day", "people rebuilding habits after a break"],
    visualStyles: ["energetic with clean typography", "fresh greens and confident darks", "bright, motivating, uncluttered"],
    fontPairs: [{ heading: "Archivo", body: "Inter", fallback: "Arial, sans-serif" }, { heading: "Barlow Condensed", body: "Source Sans 3", fallback: "Helvetica, sans-serif" }],
    taglines: ["Strong is a habit.", "Train for the long game.", "Fitness that fits your life."],
  },
  {
    key: "finance", label: "Personal Finance",
    match: ["finance", "money", "investing", "stock", "budgeting", "saving", "crypto", "business money", "personal finance", "sip", "mutual fund"],
    topics: ["budgeting for beginners", "index funds explained", "tax basics", "side income ideas", "credit & loans demystified", "compounding visualized", "money mistakes in your 20s", "emergency funds"],
    pillars: [
      { name: "Money Basics", description: "Budgeting, saving and banking explained like you're smart but new." },
      { name: "Investing 101", description: "Long-term investing without hype, jargon or stock-tip culture." },
      { name: "Mistakes & Lessons", description: "Expensive mistakes, analysed honestly so they cost you nothing." },
      { name: "Tools & Systems", description: "Simple systems and tools that run your money on autopilot." },
    ],
    namePatterns: ["{A}{N}Money", "The{N}Wallet", "{N}Compounded", "Money{N}", "Clear{N}", "{T}Sense"],
    nouns: ["Rupee", "Compound", "Ledger", "Dividend", "Margin", "Capital", "Coin", "Balance"],
    hooks: [
      "This one habit is worth more than any stock tip you'll ever get.",
      "I read the fine print so you never have to.",
      "The math behind 'start early' is more brutal than people admit.",
      "Banks hope you never ask this question.",
    ],
    audiencePhrases: ["young earners getting their first salary", "families planning long term", "students learning money basics"],
    visualStyles: ["trustworthy navy and gold", "clean editorial minimalism", "calm, precise, professional"],
    fontPairs: [{ heading: "Fraunces", body: "Inter", fallback: "Georgia, serif" }, { heading: "Libre Franklin", body: "Source Sans 3", fallback: "Helvetica, sans-serif" }],
    taglines: ["Money, demystified.", "Grow slowly. Grow surely.", "Finance without the fog."],
  },
  {
    key: "cooking", label: "Cooking & Food",
    match: ["cooking", "recipe", "food", "kitchen", "baking", "cuisine", "chef", "street food", "meal prep", "dinner", "lunch", "breakfast", "meal", "cook", "dish"],
    topics: ["15-minute weeknight dinners", "one-pot meals", "budget meal prep", "baking fundamentals", "regional recipes simplified", "knife & heat skills", "kitchen mistakes", "ingredient substitutions"],
    pillars: [
      { name: "Weeknight Wins", description: "Real dinners for real schedules — fast, cheap, repeatable." },
      { name: "Fundamentals", description: "Knife skills, heat control and the why behind each step." },
      { name: "Regional Kitchen", description: "Traditional recipes made approachable without losing soul." },
      { name: "Budget Bites", description: "Maximum flavour per rupee/dollar." },
    ],
    namePatterns: ["{A}{N}Kitchen", "The{N}Spoon", "{N}AndFlame", "Tasty{N}", "{T}Table", "{N}Bites"],
    nouns: ["Skillet", "Spice", "Tadka", "Whisk", "Sizzle", "Curry", "Dough", "Zest"],
    hooks: [
      "Five ingredients, one pan, zero regrets.",
      "The technique restaurants use that home cooks skip.",
      "This dish looks hard. It's actually three easy steps.",
      "My grandmother's version had one secret — here it is.",
    ],
    audiencePhrases: ["people cooking for the first time", "busy home cooks", "students with one pan and big appetite"],
    visualStyles: ["warm, appetising, rustic-modern", "rich reds and golden accents", "clean food-photography energy"],
    fontPairs: [{ heading: "Bricolage Grotesque", body: "Inter", fallback: "Arial, sans-serif" }, { heading: "Playfair Display", body: "Source Sans 3", fallback: "Georgia, serif" }],
    taglines: ["Cook like you mean it.", "Real food, zero fuss.", "Flavour first."],
  },
  {
    key: "travel", label: "Travel",
    match: ["travel", "trip", "tourism", "backpacking", "destination", "vlog trip", "explore", "trekking", "budget travel", "budget trip", "on a budget", "itinerary"],
    topics: ["budget itineraries", "hidden gems", "packing systems", "solo travel safety", "local food guides", "off-season travel", "transport hacks", "48-hour city plans"],
    pillars: [
      { name: "Itineraries", description: "Realistic day-by-day plans tested on actual trips." },
      { name: "Budget Travel", description: "How to see more while spending less, honestly." },
      { name: "Hidden Gems", description: "Places the top-10 lists keep missing." },
      { name: "Travel Skills", description: "Packing, safety, planning — the unglamorous essentials." },
    ],
    namePatterns: ["{A}{N}Travels", "The{N}Route", "{N}WithoutLimits", "Wander{N}", "{T}Diaries", "{N}Compass"],
    nouns: ["Atlas", "Compass", "Horizon", "Voyage", "Wander", "Trail", "Passport", "Meridian"],
    hooks: [
      "This entire trip cost less than one weekend at home.",
      "The famous spot is 2 km from something ten times better.",
      "I planned this route wrong on purpose — here's the fix.",
      "Everyone visits in December. Big mistake. Here's why.",
    ],
    audiencePhrases: ["first-time solo travellers", "budget backpackers", "weekend explorers with limited leave"],
    visualStyles: ["airy blues and sunset accents", "adventurous but uncluttered", "postcard-clean layouts"],
    fontPairs: [{ heading: "Outfit", body: "Inter", fallback: "Arial, sans-serif" }, { heading: "Manrope", body: "Source Sans 3", fallback: "Helvetica, sans-serif" }],
    taglines: ["Go further for less.", "Maps are suggestions.", "The world, on a budget."],
  },
  {
    key: "tech", label: "Technology & Coding",
    match: ["tech", "coding", "programming", "developer", "software", "web dev", "python", "javascript", "gadgets", "review tech", "app development"],
    topics: ["project tutorials", "language comparisons", "dev tool reviews", "system design basics", "portfolio projects", "AI-assisted coding", "debugging war stories", "career advice for devs"],
    pillars: [
      { name: "Build With Me", description: "Real projects built start to finish, mistakes included." },
      { name: "Tool Reviews", description: "Honest tests of developer tools — no sponsor-speak." },
      { name: "CS Foundations", description: "The concepts interviews and real systems both demand." },
      { name: "Dev Career", description: "Portfolios, interviews and growth for working developers." },
    ],
    namePatterns: ["{T}Dev", "Code{N}", "{A}{N}Stack", "The{N}Terminal", "{N}Craft", "Ship{N}"],
    nouns: ["Stack", "Commit", "Syntax", "Kernel", "Byte", "Runtime", "Deploy", "Pixel"],
    hooks: [
      "I built this the wrong way first — that version taught me more.",
      "This tool replaced three others in my workflow this month.",
      "The interview question that separates juniors from seniors.",
      "Ship it ugly, then ship it right. Full process shown.",
    ],
    audiencePhrases: ["self-taught developers", "CS students bridging theory and practice", "career switchers into tech"],
    visualStyles: ["dark IDE-inspired precision", "electric accents on deep neutrals", "minimal terminal aesthetic"],
    fontPairs: [{ heading: "JetBrains Mono", body: "Inter", fallback: "monospace" }, { heading: "Space Grotesk", body: "IBM Plex Sans", fallback: "Arial, sans-serif" }],
    taglines: ["Build it, then explain it.", "Code with intent.", "Ship something real."],
  },
  {
    key: "education", label: "Education & Study",
    match: ["study", "education", "school", "exam", "learning", "student", "tutorial", "competitive exam", "upsc", "science class"],
    topics: ["study techniques that work", "exam strategy", "memory methods", "concept breakdowns", "note-taking systems", "time management for students", "past paper analysis", "motivation without fluff"],
    pillars: [
      { name: "Concept Clarity", description: "Hard syllabus topics broken down to their simplest true form." },
      { name: "Study Systems", description: "Evidence-based techniques you can apply this week." },
      { name: "Exam Strategy", description: "Planning, papers and time management under real exam pressure." },
      { name: "Student Life", description: "Motivation, balance and habits that survive exam season." },
    ],
    namePatterns: ["{A}{N}Academy", "The{N}Classroom", "Study{N}", "{N}Simplified", "Clear{N}", "{T}School"],
    nouns: ["Slate", "Scholar", "Syllabus", "Concept", "Mentor", "Insight", "Grade", "Focus"],
    hooks: [
      "The topper's notebook had one habit nobody copies.",
      "You don't have a memory problem. You have an encoding problem.",
      "I analysed 50 past papers. The pattern is obvious once you see it.",
      "Studying 4 focused hours beats 10 distracted ones. Here's the proof.",
    ],
    audiencePhrases: ["exam-season students", "learners who've memorised without understanding", "parents supporting young students"],
    visualStyles: ["calm and structured", "friendly classroom warmth", "clean diagrams, soft colours"],
    fontPairs: [{ heading: "Lora", body: "Inter", fallback: "Georgia, serif" }, { heading: "Nunito", body: "Source Sans 3", fallback: "Arial, sans-serif" }],
    taglines: ["Learn it once, properly.", "Understanding beats memorising.", "Study smarter this semester."],
  },
  {
    key: "storytelling", label: "Storytelling & Facts",
    match: ["story", "storytelling", "stories", "documentary", "history", "mystery", "facts", "case study", "true crime", "biography"],
    topics: ["untold histories", "business rise-and-fall case studies", "mystery deep dives", "ordinary people extraordinary events", "how things really happened", "timeline reconstructions"],
    pillars: [
      { name: "Untold Stories", description: "History's footnotes, told with the respect they deserve." },
      { name: "Case Studies", description: "How empires, companies and ideas rose — and fell." },
      { name: "Mysteries & Investigations", description: "Open questions examined honestly, evidence first." },
      { name: "Mini Documentaries", description: "Single stories, fully told, in one sitting." },
    ],
    namePatterns: ["The{N}Files", "{A}{N}Chronicles", "{N}Untold", "Echoes{N}", "The{N}Archive", "{T}Reel"],
    nouns: ["Archive", "Chronicle", "Folio", "Reel", "Saga", "Ledger", "Chapter", "Vault"],
    hooks: [
      "The official story leaves out the most interesting part.",
      "One overlooked document rewrites this whole timeline.",
      "Everyone remembers the ending. Almost nobody knows the beginning.",
      "This story was buried for 40 years. Here's why.",
    ],
    audiencePhrases: ["curious viewers who love a well-told story", "history and documentary fans", "commuters wanting substance"],
    visualStyles: ["cinematic dark tones", "archival textures with modern type", "moody, documentary-grade"],
    fontPairs: [{ heading: "Playfair Display", body: "Source Serif 4", fallback: "Georgia, serif" }, { heading: "Cormorant Garamond", body: "Inter", fallback: "Georgia, serif" }],
    taglines: ["Every story has a deeper cut.", "History, honestly told.", "The stories they skipped."],
  },
  {
    key: "kids", label: "Kids & Family",
    match: ["kids", "children", "toddler", "family fun", "nursery", "learning for kids", "cartoons for kids"],
    topics: ["colour & number songs", "simple science for kids", "bedtime stories", "good habits", "craft and play ideas", "phonics fun"],
    pillars: [
      { name: "Learning Songs", description: "Catchy songs that quietly teach colours, numbers and words." },
      { name: "Story Time", description: "Gentle stories with a small lesson and a big smile." },
      { name: "Little Scientists", description: "Safe, simple experiments kids can do with a grown-up." },
      { name: "Play & Craft", description: "Creative activities from stuff already at home." },
    ],
    namePatterns: ["{A}{N}Kids", "Little{N}", "{N}Playhouse", "Tiny{N}", "Happy{N}", "{T}Corner"],
    nouns: ["Sprout", "Rainbow", "Bubble", "Giggle", "Spark", "Sunny", "Wiggle", "Star"],
    hooks: [
      "Can you count to five with the bouncy balls?",
      "Something in the garden is glowing tonight…",
      "Let's build a rocket from a cardboard box!",
    ],
    audiencePhrases: ["parents of preschoolers", "families wanting safe screen time", "early learners aged 3-7"],
    visualStyles: ["bright primary colours", "rounded friendly shapes", "playful and safe"],
    fontPairs: [{ heading: "Baloo 2", body: "Nunito", fallback: "Comic Sans MS, sans-serif" }],
    taglines: ["Big fun, little learners.", "Play. Giggle. Learn.", "Safe adventures every day."],
  },
  {
    key: "faceless", label: "Faceless Content",
    match: ["faceless", "no face", "cash cow", "voiceover", "automation channel", "without showing face"],
    topics: ["top-10 style storytelling done well", "voiceover-driven explainers", "niche documentaries", "compilation with real commentary", "scriptwriting for retention"],
    pillars: [
      { name: "Explainers", description: "Script-first videos where the story carries the watch time." },
      { name: "Rankings & Comparisons", description: "Well-researched lists with actual reasoning, not filler." },
      { name: "Deep Dives", description: "Long-form narrated documentaries on fascinating topics." },
    ],
    namePatterns: ["{A}{N}Vision", "The{N}Lens", "{N}Uncovered", "Beyond{N}", "{T}Focus", "{N}Signal"],
    nouns: ["Lens", "Signal", "Focus", "Scope", "Frame", "Insight", "Reel", "View"],
    hooks: [
      "The full story in 10 minutes, no filler.",
      "Number one will surprise you — and it's not what the articles say.",
      "We checked every source so this list actually means something.",
    ],
    audiencePhrases: ["viewers who prefer substance over faces", "commuters and second-screen watchers"],
    visualStyles: ["clean motion-graphic look", "stock-free original graphics", "crisp typography over b-roll"],
    fontPairs: [{ heading: "Montserrat", body: "Inter", fallback: "Arial, sans-serif" }],
    taglines: ["All story, no face.", "Substance first.", "Watch the story, not the host."],
  },
];

const GENERIC: NicheProfile = {
  key: "general", label: "Your Niche",
  match: [],
  topics: ["foundations and basics", "practical how-tos", "common mistakes", "tools and resources", "behind the scenes", "viewer questions"],
  pillars: [
    { name: "Foundations", description: "Everything a newcomer needs, in the right order." },
    { name: "Practical How-Tos", description: "Step-by-step videos that get a real result." },
    { name: "Mistakes & Fixes", description: "The pitfalls that waste beginners' time, and the fixes." },
    { name: "Community & Questions", description: "Answering what the audience actually asks." },
  ],
  namePatterns: ["{A}{N}", "The{N}Studio", "{N}Hub", "{T}Collective", "{N}Daily", "{T}Lab"],
  nouns: ["Spark", "Beacon", "Craft", "Pulse", "Forge", "Compass", "Nova", "Atlas"],
  hooks: [
    "Most people quit right before this part starts working.",
    "Here's what I wish someone had shown me on day one.",
    "This took me a year to learn. It takes you 8 minutes.",
    "Everything you've been told about this is slightly wrong.",
  ],
  audiencePhrases: ["beginners taking their first steps", "practitioners sharpening their skills"],
  visualStyles: ["clean modern minimalism", "confident colour with lots of air"],
  fontPairs: [{ heading: "Space Grotesk", body: "Inter", fallback: "Arial, sans-serif" }],
  taglines: ["Made simple. Made useful.", "Start here. Grow anywhere."],
};

export function detectNiche(idea: string): NicheProfile {
  const lower = idea.toLowerCase();
  let best: NicheProfile | null = null;
  let bestScore = 0;
  for (const n of NICHES) {
    // Word-boundary matching: raw substring matching let "ai" match inside
    // "explaining"/"training" and hijack the niche. \b-anchored prefixes still
    // allow plurals/inflections ("student" → "students", "math" → "mathematics").
    const score = n.match.reduce((s, m) => {
      const re = new RegExp(`\\b${m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
      return s + (re.test(lower) ? m.split(" ").length : 0);
    }, 0);
    if (score > bestScore) { bestScore = score; best = n; }
  }
  return best ?? GENERIC;
}

export { GENERIC };
