import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const script = fs.readFileSync(path.join(root, "script.js"), "utf8");

test("index.html exists and has lang=zh-CN", () => {
  assert.ok(html.includes('<html lang="zh-CN"'));
});

test("title matches required SEO string", () => {
  const m = html.match(/<title>([^<]*)<\/title>/);
  assert.ok(m, "missing <title>");
  assert.equal(m[1], "武红亮｜UI/UX设计师｜AIGC设计师｜个人作品集");
});

test("meta description / keywords / canonical / theme-color present", () => {
  for (const key of ["description", "keywords"]) {
    assert.match(html, new RegExp(`<meta name="${key}"`));
  }
  assert.match(html, /<link rel="canonical"/);
  assert.match(html, /<meta name="theme-color"/);
  assert.match(html, /<meta name="theme-color" content="#f7f7f4"/, "light theme color");
});

test("og: and twitter: tags present", () => {
  assert.match(html, /<meta property="og:title"/);
  assert.match(html, /<meta property="og:description"/);
  assert.match(html, /<meta property="og:type"/);
  assert.match(html, /<meta name="twitter:card"/);
});

test("JSON-LD Person schema present", () => {
  const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(m, "missing JSON-LD");
  const j = JSON.parse(m[1]);
  assert.equal(j["@type"], "Person");
  assert.ok(j.name.includes("武红亮"));
});

test("JSON-LD lists the 8 portfolio categories (ItemList)", () => {
  const all = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
  const list = all.find((j) => j["@type"] === "ItemList" || j["@type"] === "CollectionPage");
  assert.ok(list, "missing ItemList/CollectionPage JSON-LD");
  assert.ok(Array.isArray(list.itemListElement));
  assert.equal(list.itemListElement.length, 8);
});

test("semantic structure: header/nav/main/footer and section/figure", () => {
  for (const tag of ["<header", "<nav", "<main", "<footer", "<section", "<figure"]) {
    assert.ok(html.includes(tag), `missing ${tag}`);
  }
  const headerIdx = html.indexOf("<header");
  const mainIdx = html.indexOf("<main");
  const footerIdx = html.indexOf("<footer");
  assert.ok(headerIdx < mainIdx && mainIdx < footerIdx, "order should be header→main→footer");
});

test("exactly one h1 with required content", () => {
  const h1s = html.match(/<h1[^>]*>[\s\S]*?<\/h1>/g) || [];
  assert.equal(h1s.length, 1);
  assert.match(h1s[0], /武红亮/);
  assert.match(h1s[0], /AIGC/);
});

test("each required section has an h2", () => {
  for (const text of ["我的升级打怪之路", "从想法到可用产品", "我的视频与表达", "我的设计作品", "和我聊聊"]) {
    assert.match(html, new RegExp(`<h2[^>]*>[\\s\\S]*?${text}`), `missing h2: ${text}`);
  }
});

test("every static img has alt; content lazy flag present in script.js", () => {
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  imgs.forEach((img, i) => {
    assert.match(img, /alt="/, `img#${i} missing alt`);
  });
  assert.match(html, /loading="lazy"/, "static images should be lazy-loaded");
});

test("hero avatar mouse interaction wired (pointermove lerp, hover + reduced-motion guards)", () => {
  assert.match(script, /hero-avatar-card/, "script targets hero avatar card");
  assert.match(script, /"pointermove"/, "pointermove listener present");
  assert.match(script, /hover:\s*hover/, "hover-only guard present");
  assert.match(script, /reduceMotion/, "reduced-motion guard present");
});

test("content section: 3 bilibili video cards with covers", () => {
  const cards = (html.match(/class="video-card"/g) || []).length;
  assert.equal(cards, 3, "exactly 3 video cards");
  assert.match(html, /BV1qAyhBoEqt/, "blender video link present");
  assert.match(html, /BV1JPu96kEZe/, "ui-era video link present");
  assert.match(html, /BV1Bpuz6AE4t/, "website video link present");
  assert.ok(html.includes('href="https://www.bilibili.com/video/'), "cards link to bilibili");
  assert.ok(html.includes('assets/content/v1.webp'), "cover 1 present");
  assert.ok(html.includes('assets/content/v2.webp'), "cover 2 present");
  assert.ok(html.includes('assets/content/v3.webp'), "cover 3 present");
  assert.ok(html.includes('原来blender这么简单'), "blender title");
  assert.ok(html.includes('AI时代，还需要UI吗？'), "ui-era title");
  assert.ok(html.includes('5分钟教会你 如何设计高端网站'), "website title");
  assert.ok(fs.existsSync(path.join(root, "assets/content/v1.webp")), "cover 1 file exists");
  assert.ok(fs.existsSync(path.join(root, "assets/content/v2.webp")), "cover 2 file exists");
  assert.ok(fs.existsSync(path.join(root, "assets/content/v3.webp")), "cover 3 file exists");
});

test("portfolio data is inline (works without fetch): media files + modal present", () => {
  assert.ok(html.includes('id="workModal"'), "modal still present");
  assert.ok(html.includes("portfolio-data.js"), "index.html should load portfolio-data.js");
  assert.ok(fs.existsSync(path.join(root, "portfolio-data.js")), "portfolio-data.js should exist");
  const data = fs.readFileSync(path.join(root, "portfolio-data.js"), "utf8");
  assert.match(data, /window\.PORTFOLIO_DATA\s*=/, "should expose window.PORTFOLIO_DATA");
  assert.match(script, /window\.PORTFOLIO_DATA/, "script.js should read inline data");
  assert.doesNotMatch(script, /fetch\(\s*["']portfolio\.json["']\)/, "script.js must not fetch portfolio.json");
});

test("robots.txt and sitemap.xml exist", () => {
  assert.ok(fs.existsSync(path.join(root, "robots.txt")));
  assert.ok(fs.existsSync(path.join(root, "sitemap.xml")));
});

test("journey: timeline with JetBrains-style time and skill tags present", () => {
  assert.ok(html.includes('class="timeline '), "missing timeline");
  assert.ok(html.includes('class="skill-tags"'), "missing skill-tags");
  assert.ok(html.includes("<time>"), "timeline should use <time>");
});

test("product cards: two live product links (woze.de5.net / qrsk.de5.net)", () => {
  assert.match(html, /class="product-grid[^"]*"/, "missing product grid");
  assert.match(html, /href="https:\/\/woze\.de5\.net[^"]*" target="_blank"/, "woze link opens new tab");
  assert.match(html, /href="https:\/\/qrsk\.de5\.net[^"]*" target="_blank"/, "qrsk link opens new tab");
  assert.ok(html.includes('woze.de5.net'), "woze url shown");
  assert.ok(html.includes('qrsk.de5.net'), "qrsk url shown");
  assert.ok(html.includes("AI 设计工具导航"), "product 1 name");
  assert.ok(html.includes("二维码制作工具"), "product 2 name");
  assert.doesNotMatch(html, /id="productTabs"/, "terminal tabs removed");
  assert.doesNotMatch(html, /id="terminalOutput"/, "terminal removed");
  assert.doesNotMatch(html, /id="worksMarquee"/, "works marquee removed");
});

test("life section: sticker field + work folders present (liuliulab-style)", () => {
  assert.ok(html.includes('class="life-sticker-field"'), "missing sticker field");
  assert.ok(html.includes('class="life-ambient-sticker '), "missing ambient stickers");
  assert.ok(html.includes('class="folder-grid reveal-stagger"'), "missing folder grid");
  assert.ok(html.includes('data-folder'), "missing folder cards");
  assert.ok(html.includes('class="folder-sticker sticker-round"'), "missing round sticker");
  assert.ok(!html.includes('class="folder-sticker sticker-note"'), "note stickers removed");
  assert.ok(html.includes('assets/life/work/app/'), "app work photos mounted");
  assert.ok(html.includes('assets/life/work/logo/'), "logo work photos mounted");
  assert.ok(html.includes('assets/life/work/web/'), "web work photos mounted");
});

test("folder lightbox: pure image layer, no text/border", () => {
  assert.ok(html.includes('id="workLightbox"'), "missing lightbox");
  assert.ok(html.includes('class="lightbox-stage"'), "missing stage");
  assert.ok(html.includes('id="lightboxImg"'), "missing lightbox img");
  assert.ok(html.includes('id="lightboxStage"'), "missing lightbox stage");
  assert.match(html, /data-lightbox-close/, "closable");
  const lbBlock = html.slice(html.indexOf('id="workLightbox"'), html.indexOf('id="wechat-popover"'));
  assert.ok(!lbBlock.includes("figcaption"), "no image caption text in lightbox");
  assert.ok(!lbBlock.includes("modal-desc"), "no description text in lightbox");
  assert.ok(html.includes('class="lightbox-window"'), "missing lightbox window");
  assert.match(html, /data-resize="nw|ne|se|sw|n|e|s|w"/, "resize handles present");
  assert.match(html, /data-lightbox-drag/, "drag titlebar present");
  assert.match(script, /workLightboxSize/, "remembers lightbox size");
  assert.match(script, /pointerdown/, "gesture via pointer events");
  const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
  assert.match(css, /\.lightbox-stage img[\s\S]*?object-fit: contain/, "image fills stage");
  assert.ok(!html.includes('id="lightboxImgWrap"'), "no inner image wrapper");
  assert.ok(!html.includes("data-imgresize"), "no image resize handles");
  assert.ok(!html.includes("data-zoom"), "no image zoom controls");
  assert.ok(!css.includes(".lightbox-stage img { border"));
});

test("calm hero: static focus word, single CTA, no typewriter/canvas/marquee", () => {
  assert.ok(html.includes('class="focus-word"'), "static focus word present");
  assert.ok(html.includes('class="hero-avatar-card"'), "dignified avatar card present");
  assert.ok(html.includes('class="ghost-link"'), "secondary ghost link present");
  assert.doesNotMatch(html, /heroLiquid/, "canvas liquid removed");
  assert.doesNotMatch(html, /id="typewriter"/, "typewriter removed");
  assert.doesNotMatch(html, /hero-avatar-star|hero-avatar-heart/, "playful hero sticker decoration removed");
});

test("light style system present in html", () => {
  assert.ok(html.includes("Geist"), "Geist font linked");
  assert.ok(html.includes("JetBrains+Mono"), "JetBrains Mono font linked");
  assert.match(html, /button-dark/, "dark pill button present");
  assert.match(html, /button-light/, "light pill button present");
  assert.match(html, /class="nav-links"/, "nav links present");
  assert.match(html, /id="wechat-popover"/, "wechat popover present");
  assert.match(html, /Back To Top/, "footer Back To Top present");
});