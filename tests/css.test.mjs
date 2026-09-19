import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

test("css defines light design tokens", () => {
  for (const token of ["--bg", "--ink", "--muted", "--accent", "--border", "--surface", "--accent-soft"]) {
    assert.ok(css.includes(token), `missing token ${token}`);
  }
  assert.match(css, /--bg:\s*#f7f7f4/);
  assert.match(css, /--accent:\s*#1658a2/);
});

test("fonts: Geist + JetBrains Mono declared", () => {
  assert.match(css, /Geist/);
  assert.match(css, /"JetBrains Mono"/);
});

test("responsive breakpoints exist (mobile/tablet)", () => {
  assert.match(css, /@media \(max-width:\s*767px\)/);
  assert.match(css, /@media \(max-width:\s*1023px\)/);
});

test("folder collage classes defined (reference-style 12-col grid)", () => {
  for (const cls of ["folder-grid", "folder-card", "folder-scene", "folder-back", "folder-front", "folder-photo", "folder-sticker", "sticker-round"]) {
    assert.ok(css.includes(cls), `missing class ${cls}`);
  }
  assert.match(css, /\.folder-grid[\s\S]*?grid-template-columns:\s*repeat\(12/);
  assert.match(css, /\.folder-card:hover/, "folder hover states present");
  assert.match(css, /photo-four/, "fourth photo fan state present");
});

test("prefers-reduced-motion support", () => {
  assert.match(css, /prefers-reduced-motion\s*:\s*reduce/);
});

test("grid/flex layout keywords present", () => {
  assert.ok(css.includes("display:grid") || css.includes("display: grid"), "missing grid");
  assert.ok(css.includes("display:flex") || css.includes("display: flex"), "missing flex");
});

test("aspect-ratio used to prevent CLS", () => {
  assert.match(css, /aspect-ratio/);
});

test("product cards component present (two live products)", () => {
  assert.match(css, /\.product-grid[\s\S]*?grid-template-columns:\s*repeat\(2/);
  assert.match(css, /\.product-card/);
  assert.match(css, /\.product-card-head/);
  assert.match(css, /\.mac-dots/);
  assert.match(css, /\.product-features/);
  assert.doesNotMatch(css, /\.works-marquee/, "works marquee removed");
  assert.doesNotMatch(css, /@keyframes\s+marquee/, "marquee loop removed");
});

test("calm hero + life sticker field present", () => {
  assert.match(css, /\.hero-avatar-card/);
  assert.match(css, /\.ghost-link/);
  assert.match(css, /\.life-sticker-field/);
  assert.match(css, /\.life-ambient-sticker/);
  assert.match(css, /\.life-sticker-motion/);
  assert.doesNotMatch(css, /\.hero-liquid/, "canvas liquid removed");
  assert.doesNotMatch(css, /@keyframes\s+pulse/, "pulse loop removed");
  assert.match(css, /life-sticker-drift/, "sticker drift keyframes present (reference layout)");
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.life-sticker-motion\s*\{\s*animation:\s*none/, "sticker animation off under reduced motion");
});

test("radius token used for cards", () => {
  assert.match(css, /--radius:\s*18px/);
  assert.match(css, /border-radius:\s*var\(--radius\)/);
});

test("product card body + CTA styles present", () => {
  assert.match(css, /\.product-card-body/);
  assert.match(css, /\.product-desc/);
  assert.match(css, /\.product-url/);
  assert.doesNotMatch(css, /\.terminal-output/, "terminal console removed");
  assert.doesNotMatch(css, /\.terminal-shell/);
  assert.doesNotMatch(css, /\.product-tab/);
});

test("noise grain overlay present", () => {
  assert.match(css, /body::after[\s\S]*?fractalNoise/);
});