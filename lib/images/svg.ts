// Deterministic SVG brand-asset renderers used by the demo image provider.
// These produce genuinely styled, brand-colored artwork (not placeholders):
// gradients, monograms, style-specific compositions rendered to PNG via sharp.

export interface SvgBrand {
  brandName: string;
  tagline?: string;
  colors: string[]; // [primary, secondary, accent, background]
  style: string;
  uploadSchedule?: string;
}

const FONT = "'DejaVu Sans', Arial, sans-serif";

export function initials(name: string): string {
  const words = name.replace(/[^a-zA-Z0-9 ]/g, " ").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "CF";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ── LOGO (square) ─────────────────────────────────────────
export function renderLogoSvg(brand: SvgBrand, size = 800): string {
  const [p, s, a] = [brand.colors[0] ?? "#4f46e5", brand.colors[1] ?? "#8b5cf6", brand.colors[2] ?? "#f59e0b"];
  const mono = initials(brand.brandName);
  const style = brand.style.toLowerCase();
  const id = "g1";

  let bg = ""; let deco = ""; let fg = "#ffffff"; let monoFill = "#ffffff";

  if (style.includes("minimal") || style.includes("flat")) {
    bg = `<rect width="${size}" height="${size}" rx="${size * 0.12}" fill="${p}"/>`;
    deco = `<circle cx="${size * 0.78}" cy="${size * 0.22}" r="${size * 0.07}" fill="${a}"/>`;
  } else if (style.includes("gaming")) {
    bg = `<rect width="${size}" height="${size}" rx="${size * 0.1}" fill="#0f172a"/>
      <path d="M0 ${size * 0.72} L${size} ${size * 0.45} L${size} ${size} L0 ${size} Z" fill="${p}" opacity="0.9"/>
      <path d="M0 ${size * 0.85} L${size} ${size * 0.62} L${size} ${size} L0 ${size} Z" fill="${s}" opacity="0.8"/>`;
  } else if (style.includes("luxury")) {
    bg = `<rect width="${size}" height="${size}" rx="${size * 0.06}" fill="#111827"/>
      <rect x="${size * 0.06}" y="${size * 0.06}" width="${size * 0.88}" height="${size * 0.88}" rx="${size * 0.04}" fill="none" stroke="${a}" stroke-width="${size * 0.008}"/>`;
    monoFill = a;
  } else if (style.includes("tech")) {
    bg = `<rect width="${size}" height="${size}" rx="${size * 0.12}" fill="#0b1120"/>
      <g stroke="${p}" stroke-width="${size * 0.006}" opacity="0.5">
        <line x1="0" y1="${size * 0.25}" x2="${size}" y2="${size * 0.25}"/>
        <line x1="0" y1="${size * 0.75}" x2="${size}" y2="${size * 0.75}"/>
        <line x1="${size * 0.25}" y1="0" x2="${size * 0.25}" y2="${size}"/>
        <line x1="${size * 0.75}" y1="0" x2="${size * 0.75}" y2="${size}"/>
      </g>
      <circle cx="${size * 0.25}" cy="${size * 0.25}" r="${size * 0.02}" fill="${a}"/>
      <circle cx="${size * 0.75}" cy="${size * 0.75}" r="${size * 0.02}" fill="${a}"/>`;
  } else if (style.includes("educational")) {
    bg = `<rect width="${size}" height="${size}" rx="${size * 0.12}" fill="${p}"/>
      <path d="M${size * 0.14} ${size * 0.78} q${size * 0.18} -${size * 0.1} ${size * 0.36} 0 l0 -${size * 0.3} q-${size * 0.18} -${size * 0.1} -${size * 0.36} 0 Z" fill="#ffffff" opacity="0.25"/>`;
  } else if (style.includes("cartoon") || style.includes("mascot")) {
    bg = `<rect width="${size}" height="${size}" rx="${size * 0.2}" fill="${a}"/>
      <circle cx="${size * 0.5}" cy="${size * 0.52}" r="${size * 0.32}" fill="#ffffff"/>
      <circle cx="${size * 0.38}" cy="${size * 0.46}" r="${size * 0.045}" fill="#1e293b"/>
      <circle cx="${size * 0.62}" cy="${size * 0.46}" r="${size * 0.045}" fill="#1e293b"/>
      <path d="M${size * 0.38} ${size * 0.6} q${size * 0.12} ${size * 0.1} ${size * 0.24} 0" stroke="#1e293b" stroke-width="${size * 0.02}" fill="none" stroke-linecap="round"/>`;
    monoFill = p;
  } else if (style.includes("abstract")) {
    bg = `<rect width="${size}" height="${size}" fill="${p}"/>
      <circle cx="${size * 0.25}" cy="${size * 0.3}" r="${size * 0.35}" fill="${s}" opacity="0.85"/>
      <circle cx="${size * 0.72}" cy="${size * 0.68}" r="${size * 0.3}" fill="${a}" opacity="0.9"/>`;
  } else if (style.includes("typography")) {
    bg = `<rect width="${size}" height="${size}" fill="#f8fafc"/>`;
    monoFill = p;
    deco = `<rect x="${size * 0.1}" y="${size * 0.86}" width="${size * 0.8}" height="${size * 0.02}" fill="${a}"/>`;
  } else {
    // Modern / 3D default: signature gradient
    bg = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${p}"/><stop offset="1" stop-color="${s}"/>
      </linearGradient></defs>
      <rect width="${size}" height="${size}" rx="${size * 0.16}" fill="url(#${id})"/>
      <circle cx="${size * 0.82}" cy="${size * 0.18}" r="${size * 0.12}" fill="#ffffff" opacity="0.15"/>`;
  }

  const playGlyph = `<path d="M${size * 0.62} ${size * 0.5} l${size * 0.12} ${size * 0.075} l-${size * 0.12} ${size * 0.075} Z" fill="${a}"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    ${bg}${deco}
    <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="${FONT}" font-weight="bold" font-size="${size * 0.38}" fill="${monoFill}">${esc(mono)}</text>
    ${style.includes("modern") || style.includes("3d") || style.includes("abstract") ? playGlyph : ""}
  </svg>`;
}

// ── BANNER 2560x1440, safe area 1546x425 centered ─────────
export function renderBannerSvg(brand: SvgBrand, width = 2560, height = 1440): string {
  const [p, s, a] = [brand.colors[0] ?? "#4f46e5", brand.colors[1] ?? "#8b5cf6", brand.colors[2] ?? "#f59e0b"];
  const tagline = brand.tagline ?? "";
  const schedule = brand.uploadSchedule ?? "";
  const style = brand.style.toLowerCase();

  const dark = style.includes("gaming") || style.includes("luxury") || style.includes("tech");
  const base = dark ? "#0b1120" : "#f8fafc";
  const textMain = dark ? "#f8fafc" : "#0f172a";

  // Edge decoration only (survives YouTube's side crops on desktop/mobile).
  const edges = `
    <circle cx="180" cy="220" r="420" fill="${p}" opacity="0.16"/>
    <circle cx="2420" cy="1250" r="520" fill="${s}" opacity="0.18"/>
    <circle cx="2480" cy="180" r="200" fill="${a}" opacity="0.25"/>
    <circle cx="120" cy="1300" r="260" fill="${s}" opacity="0.14"/>`;

  const nameSize = brand.brandName.length > 18 ? 120 : 150;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="bannerBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${base}"/>
        <stop offset="1" stop-color="${dark ? "#1e1b4b" : "#eef2ff"}"/>
      </linearGradient>
      <linearGradient id="accentBar" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="${p}"/><stop offset="1" stop-color="${a}"/>
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#bannerBg)"/>
    ${edges}
    <g text-anchor="middle" font-family="${FONT}">
      <text x="${width / 2}" y="${height / 2 - 40}" font-weight="bold" font-size="${nameSize}" fill="${textMain}">${esc(brand.brandName)}</text>
      <rect x="${width / 2 - 260}" y="${height / 2 + 20}" width="520" height="10" rx="5" fill="url(#accentBar)"/>
      ${tagline ? `<text x="${width / 2}" y="${height / 2 + 110}" font-size="58" fill="${dark ? "#c7d2fe" : "#475569"}">${esc(tagline)}</text>` : ""}
      ${schedule ? `<text x="${width / 2}" y="${height / 2 + 185}" font-size="40" fill="${a}" font-weight="bold">${esc(schedule)}</text>` : ""}
    </g>
  </svg>`;
}

// ── WATERMARK 300x300 transparent ─────────────────────────
export function renderWatermarkSvg(brand: SvgBrand, kind: "logo" | "initials" | "icon", size = 300): string {
  const [p, a] = [brand.colors[0] ?? "#4f46e5", brand.colors[2] ?? "#f59e0b"];
  if (kind === "icon") {
    // Simple play glyph mark, recognizable at 40px.
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.44}" fill="${p}"/>
      <path d="M${size * 0.38} ${size * 0.3} L${size * 0.72} ${size * 0.5} L${size * 0.38} ${size * 0.7} Z" fill="#ffffff"/>
    </svg>`;
  }
  if (kind === "logo") {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <rect x="${size * 0.06}" y="${size * 0.06}" width="${size * 0.88}" height="${size * 0.88}" rx="${size * 0.2}" fill="${p}"/>
      <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="${FONT}" font-weight="bold" font-size="${size * 0.4}" fill="#ffffff">${esc(initials(brand.brandName))}</text>
      <circle cx="${size * 0.8}" cy="${size * 0.2}" r="${size * 0.07}" fill="${a}"/>
    </svg>`;
  }
  // initials
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <text x="50%" y="56%" text-anchor="middle" dominant-baseline="middle" font-family="${FONT}" font-weight="bold" font-size="${size * 0.55}" fill="${p}" opacity="0.92">${esc(initials(brand.brandName))}</text>
  </svg>`;
}
