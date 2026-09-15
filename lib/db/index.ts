import "server-only";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { logger } from "../utils/logger";
import type {
  User, Session, Project, BrandKit, GeneratedAsset, KeywordSet,
  ContentIdea, GenerationRequest, UsageEvent, AnalyticsEvent, SavedGeneration,
} from "./types";

interface DbShape {
  users: User[];
  sessions: Session[];
  projects: Project[];
  brandKits: BrandKit[];
  assets: GeneratedAsset[];
  keywordSets: KeywordSet[];
  contentIdeas: ContentIdea[];
  generationRequests: GenerationRequest[];
  usageEvents: UsageEvent[];
  analyticsEvents: AnalyticsEvent[];
  savedGenerations: SavedGeneration[];
}

const DATA_DIR = join(process.cwd(), "data");
const DB_FILE = join(DATA_DIR, "db.json");

function empty(): DbShape {
  return {
    users: [], sessions: [], projects: [], brandKits: [], assets: [],
    keywordSets: [], contentIdeas: [], generationRequests: [],
    usageEvents: [], analyticsEvents: [], savedGenerations: [],
  };
}

let db: DbShape | null = null;
let saveTimer: ReturnType<typeof setTimeout> | null = null;

export function getDb(): DbShape {
  if (db) return db;
  let loaded: DbShape;
  try {
    if (existsSync(DB_FILE)) {
      loaded = { ...empty(), ...JSON.parse(readFileSync(DB_FILE, "utf8")) };
    } else {
      loaded = empty();
    }
  } catch (e) {
    logger.error("db_load_failed", { error: String(e) });
    loaded = empty();
  }
  db = loaded;
  return loaded;
}

export function persist() {
  const d = getDb();
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      mkdirSync(DATA_DIR, { recursive: true });
      writeFileSync(DB_FILE, JSON.stringify(d));
    } catch (e) {
      logger.error("db_persist_failed", { error: String(e) });
    }
  }, 100);
}

// Persist immediately for critical writes (auth, billing).
export function persistNow() {
  if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
  try {
    mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(DB_FILE, JSON.stringify(getDb()));
  } catch (e) {
    logger.error("db_persist_failed", { error: String(e) });
  }
}

export const collections = {
  users: () => getDb().users,
  sessions: () => getDb().sessions,
  projects: () => getDb().projects,
  brandKits: () => getDb().brandKits,
  assets: () => getDb().assets,
  keywordSets: () => getDb().keywordSets,
  contentIdeas: () => getDb().contentIdeas,
  generationRequests: () => getDb().generationRequests,
  usageEvents: () => getDb().usageEvents,
  analyticsEvents: () => getDb().analyticsEvents,
  savedGenerations: () => getDb().savedGenerations,
};
