// gta6-meme-x-01 — "I waited 13 years for GTA VI"
// A tiny Node 22 program (standard library only, no network) that draws the
// meme as a 1200x675 SVG and writes it to output/meme.svg.
//
// The joke: the human waited 13 years for GTA VI; their AI agent got paid
// on make.fun instead. The make.fun ghost — drawn from scratch here, round
// head, wavy bottom, two eyes — is the hero, game controller in hand.
// "make.fun" is the biggest text in the picture, as the bounty requires.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const W = 1200;
const H = 675;

const SKY_TOP = "#150829";
const SKY_MID = "#3b0f54";
const SKY_LOW = "#b3125e";
const HORIZON = "#ff5e3a";
const SUN_TOP = "#ffd319";
const SUN_LOW = "#ff2975";
const GROUND = "#0d0518";
const PALM = "#0a0318";
const NEON_PINK = "#ff2e88";
const NEON_CYAN = "#22d3ee";
const GOLD = "#ffd319";
const INK = "#1a0b2e";

// Deterministic pseudo-random stars, so every run draws the same sky.
function lcg(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function defs(): string {
  return `<defs>
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${SKY_TOP}" />
      <stop offset="45%" stop-color="${SKY_MID}" />
      <stop offset="75%" stop-color="${SKY_LOW}" />
      <stop offset="100%" stop-color="${HORIZON}" />
    </linearGradient>
    <linearGradient id="sunGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${SUN_TOP}" />
      <stop offset="100%" stop-color="${SUN_LOW}" />
    </linearGradient>
    <clipPath id="sunClip"><circle cx="600" cy="340" r="150" /></clipPath>
    <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="7" result="blur" />
      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
  </defs>`;
}

function sky(): string {
  return `<rect width="${W}" height="470" fill="url(#skyGrad)" />`;
}

function stars(): string {
  const rand = lcg(20261121);
  const dots: string[] = [];
  for (let i = 0; i < 70; i++) {
    const x = Math.round(rand() * W);
    const y = Math.round(rand() * 260);
    const r = (rand() * 1.6 + 0.6).toFixed(1);
    const o = (rand() * 0.6 + 0.4).toFixed(2);
    dots.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="#ffffff" opacity="${o}" />`);
  }
  return dots.join("\n    ");
}

function sun(): string {
  // Retro striped sun: gradient disc, horizontal slices cut out of its half.
  const slices: string[] = [];
  let y = 360;
  let h = 6;
  while (y < 490) {
    slices.push(`<rect x="430" y="${y}" width="340" height="${h}" fill="${SKY_MID}" opacity="0.85" />`);
    y += h + 16;
    h += 3;
  }
  return `<circle cx="600" cy="340" r="150" fill="url(#sunGrad)" />
    <g clip-path="url(#sunClip)">
    ${slices.join("\n    ")}
    </g>`;
}

function groundGrid(): string {
  const lines: string[] = [];
  lines.push(`<rect x="0" y="440" width="${W}" height="235" fill="${GROUND}" />`);
  lines.push(`<line x1="0" y1="440" x2="${W}" y2="440" stroke="${NEON_CYAN}" stroke-width="3" opacity="0.8" />`);
  for (const x of [0, 200, 400, 600, 800, 1000, 1200]) {
    lines.push(`<line x1="600" y1="440" x2="${x}" y2="675" stroke="${NEON_PINK}" stroke-width="2" opacity="0.35" />`);
  }
  for (const y of [460, 485, 515, 550, 590, 635]) {
    lines.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${NEON_PINK}" stroke-width="2" opacity="0.35" />`);
  }
  return lines.join("\n    ");
}

function palm(baseX: number, baseY: number, s: number, flip: boolean): string {
  const dir = flip ? -1 : 1;
  const crownX = baseX + 45 * dir * s;
  const crownY = baseY - 265 * s;
  // [endDx, endDy, ctrlDx, ctrlDy] of each frond, relative to the crown.
  const fronds: Array<[number, number, number, number]> = [
    [-95, -5, -70, -45],
    [-70, -55, -55, -75],
    [-15, -72, -5, -85],
    [40, -62, 35, -80],
    [88, -18, 75, -50],
    [70, 30, 80, -5],
  ];
  const parts: string[] = [];
  parts.push(`<path d="M ${baseX} ${baseY} Q ${baseX + 12 * dir * s} ${baseY - 140 * s} ${crownX} ${crownY}" stroke="${PALM}" stroke-width="${13 * s}" fill="none" stroke-linecap="round" />`);
  for (const [edx, edy, cdx, cdy] of fronds) {
    parts.push(`<path d="M ${crownX} ${crownY} Q ${crownX + cdx * dir * s} ${crownY + cdy * s} ${crownX + edx * dir * s} ${crownY + edy * s}" stroke="${PALM}" stroke-width="${7 * s}" fill="none" stroke-linecap="round" />`);
  }
  parts.push(`<circle cx="${crownX - 12 * dir * s}" cy="${crownY + 8 * s}" r="${7 * s}" fill="${PALM}" />`);
  parts.push(`<circle cx="${crownX + 10 * dir * s}" cy="${crownY + 12 * s}" r="${6 * s}" fill="${PALM}" />`);
  return parts.join("\n    ");
}

function ghost(cx: number, cy: number, s: number): string {
  return `<g transform="translate(${cx},${cy}) scale(${s})">
    <path d="M -80 90 L -80 -10 A 80 80 0 0 1 80 -10 L 80 90 Q 60 66 40 90 Q 20 66 0 90 Q -20 66 -40 90 Q -60 66 -80 90 Z" fill="#ffffff" stroke="${INK}" stroke-width="4" stroke-linejoin="round" />
    <ellipse cx="-30" cy="-28" rx="12" ry="17" fill="${INK}" />
    <ellipse cx="30" cy="-28" rx="12" ry="17" fill="${INK}" />
    <circle cx="-26" cy="-34" r="4" fill="#ffffff" />
    <circle cx="34" cy="-34" r="4" fill="#ffffff" />
    <path d="M -16 12 Q 0 26 16 12" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round" />
    <circle cx="-68" cy="83" r="10" fill="#ffffff" stroke="${INK}" stroke-width="3" />
    <circle cx="68" cy="83" r="10" fill="#ffffff" stroke="${INK}" stroke-width="3" />
    <g transform="translate(-70,52)">
      <rect x="0" y="0" width="140" height="62" rx="18" fill="#1f2937" stroke="#4b5563" stroke-width="2" />
      <rect x="18" y="26" width="28" height="10" rx="2" fill="#9ca3af" />
      <rect x="27" y="17" width="10" height="28" rx="2" fill="#9ca3af" />
      <circle cx="100" cy="22" r="6" fill="${NEON_PINK}" />
      <circle cx="114" cy="34" r="6" fill="${GOLD}" />
      <circle cx="100" cy="46" r="6" fill="${NEON_CYAN}" />
      <circle cx="86" cy="34" r="6" fill="#a78bfa" />
    </g>
  </g>`;
}

function bubble(x: number, y: number, label: string): string {
  return `<g>
    <rect x="${x}" y="${y}" width="120" height="58" rx="16" fill="#ffffff" stroke="${INK}" stroke-width="3" />
    <polygon points="${x + 18},${y + 56} ${x + 10},${y + 80} ${x + 38},${y + 56}" fill="#ffffff" />
    <text x="${x + 60}" y="${y + 39}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="900" fill="${INK}">${label}</text>
  </g>`;
}

function topText(): string {
  return `<text x="600" y="78" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="46" font-weight="900" letter-spacing="2" fill="#ffffff" stroke="${INK}" stroke-width="8" paint-order="stroke" stroke-linejoin="round">I WAITED 13 YEARS FOR GTA VI</text>`;
}

function bottomText(): string {
  return `<text x="600" y="566" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="36" font-weight="800" letter-spacing="2" fill="${GOLD}" stroke="${INK}" stroke-width="6" paint-order="stroke" stroke-linejoin="round">MY AGENT GOT PAID ON</text>
    <text x="600" y="656" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="100" font-weight="900" letter-spacing="1" fill="#ffffff" stroke="#ff2975" stroke-width="3" paint-order="stroke" stroke-linejoin="round" filter="url(#glow)">make.fun</text>`;
}

function buildMeme(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${defs()}
  ${sky()}
  ${stars()}
  ${sun()}
  ${groundGrid()}
  ${palm(95, 675, 1, false)}
  ${palm(1105, 675, 0.9, true)}
  ${ghost(600, 390, 1)}
  ${bubble(706, 232, "GG.")}
  ${topText()}
  ${bottomText()}
  <rect x="8" y="8" width="1184" height="659" rx="20" fill="none" stroke="${NEON_PINK}" stroke-width="3" opacity="0.5" />
</svg>
`;
}

function main(): void {
  const here = dirname(fileURLToPath(import.meta.url));
  // The grader runs the program with its own directory read-only and
  // hands it a writable output directory through MAKEFUN_OUTPUT_DIR.
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || join(here, "output");
  mkdirSync(outDir, { recursive: true });
  const svg = buildMeme();
  const outFile = join(outDir, "meme.svg");
  writeFileSync(outFile, svg, "utf8");
  console.log(`meme written: ${outFile} (${svg.length} bytes)`);
}

main();
