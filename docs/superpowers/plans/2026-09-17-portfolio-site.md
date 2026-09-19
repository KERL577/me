# 武红亮个人设计师品牌网站 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个纯静态、SEO 优化、文件夹式作品集展示的个人设计师品牌网站（index.html + style.css + script.js + portfolio.json）。

**Architecture:** 单页 + 详情弹窗。作品数据由 `portfolio.json` 驱动，JS `fetch` 后渲染 8 个 `folder-scene` 文件夹（参考 liuliulab.org 文件夹设计）。其余内容段（关于/能力/生活/联系）静态写入 HTML 以保证 SEO。图片用 `cwebp`（macOS Homebrew）批量转 WebP 并缩放到 1600px。

**Tech Stack:** HTML5、CSS3（CSS Variables/Grid）、原生 JavaScript（ES2020，一次 `fetch` + IntersectionObserver + 弹窗）、Node 内置 `node --test`（测试）、`cwebp`（图片转换）。

**Spec:** `docs/superpowers/specs/2026-09-17-portfolio-site-design.md`

## Global Constraints

- 纯静态：无框架、无构建工具、无运行时第三方 JS。
- 中文系统字体栈（PingFang SC / Hiragino Sans GB / Microsoft YaHei）；英文 Inter 经 Google Fonts（`preconnect` + `display=swap`）。
- 色板：`--bg:#f7f6f3` `--surface:#ffffff` `--ink:#191919` `--muted:#76706a` `--accent:#6f5bd1` `--accent-soft:#ece8f8` `--border:#e6e4e0`。
- 容器最大宽 1180px；桌面 section 纵向留白 ~120px、移动 ~80px。
- 响应式断点：≥1024 桌面 / 768–1023 平板 / ≤767 移动。
- 所有作品 `<img>` 必须 `loading="lazy"` + `width`/`height` 或 `aspect-ratio` + 描述性 `alt`。
- 图片输出：`cwebp -q 80 -resize 1600 0` 至 `assets/works/<category_id>/<n>.webp`，源目录不变。
- SEO：语义化（header/nav/main/section/article/figure/footer）、唯一 H1「武红亮 - AIGC时代UI/UX设计师」、每个 section 一个 H2、`lang="zh-CN"`、title/description/keywords/OG/JSON-LD/canonical、`robots.txt` + `sitemap.xml`。
- 动效轻量：仅 hover 位移 + IntersectionObserver 淡入（`.reveal`/`.is-visible`），支持 `prefers-reduced-motion: reduce` 全部禁用。无动画库。
- Lighthouse 目标：Performance >90、SEO >95。
- 运行测试：`npm test`（等价 `node --test tests/`）。
- 8 个分类 id 与文案（写死约定，见下方「分类数据约定」）。

## 分类数据约定

| id | name | type | company | year | description | tags |
|----|------|------|---------|------|-------------|------|
| `360` | 360 作品 | 软件产品设计 | 奇虎360 | 2014–2017 | 负责 360 安全卫士体验设计，服务数亿用户的安全软件界面优化。 | 软件产品 / 千万级用户 |
| `baanju` | 百安居作品 | 零售×AIGC 设计 | 百安居 | 2024 | 数字人形象定制、IP 吉祥物数智化设计与线上产品支持。 | 数字人 / IP 吉祥物 |
| `paiouyun` | 派欧云作品 | 网站与 AIGC 设计 | 派欧云 | 2024 | 产品官网设计、AI 图片生成、宣传短视频与数字人定制。 | 网站设计 / AIGC |
| `weimob` | 微盟作品 | B 端产品设计 | 微盟 | 2020–2023 | 负责 B 端产品用户体验设计，主导核心产品方案与团队交付。 | B 端产品 / 团队管理 |
| `zhongan` | 众安作品 | 移动端产品设计 | 众安在线 | 2018–2020 | 优化众安保险 APP 购买与理赔流程体验，覆盖 C 端金融场景。 | 移动端 / 金融 |
| `freelance` | 自己接单作品 | 商业设计 | 独立项目 | 各时期 | 独立承接的品牌视觉与数字化设计项目。 | 品牌 / 商业项目 |
| `ip` | IP 形象设计作品 | IP 与吉祥物设计 | 各品牌 | 2024 | IP 形象与吉祥物创意设计，探索 AIGC 辅助角色创作。 | IP / 吉祥物 |
| `logo` | Logo 设计作品 | 品牌视觉设计 | 各品牌 | 2012–今 | Logo 与标志系统设计，涵盖多行业品牌。 | 品牌视觉 / Logo |

源目录 → 输出目录映射：

| 源目录（作品集/） | 输出目录（assets/works/） |
|---|---|
| `360作品` | `360/` |
| `百安居作品` | `baanju/` |
| `派欧云作品` | `paiouyun/` |
| `微盟作品` | `weimob/` |
| `众安作品` | `zhongan/` |
| `自己接单作品` | `freelance/` |
| `IP形象设计作品` | `ip/` |
| `logo设计作品` | `logo/` |

---

### Task 1: 图片转换工具与 72 张 WebP 产出

**Files:**
- Create: `tools/convert-images.sh`
- Create: `assets/works/`（8 个子目录，各含 `<n>.webp`）

**Interfaces:**
- Produces: `assets/works/<category_id>/<n>.webp`（n 从 1 起，含 IP 分类的 jpg→webp）
- 测试依赖这些文件存在（Task 3 的数据测试会校验）

- [ ] **Step 1: 创建转换脚本**

`tools/convert-images.sh`（bash，幂等：已存在且新者跳过）：

```bash
#!/usr/bin/env bash
# 将 /Users/wuhongliang/项目/me/作品集 下 8 个分类的图片转为 WebP（q80, 宽≤1600px）
set -euo pipefail
SRC_ROOT="/Users/wuhongliang/项目/me/作品集"
OUT_ROOT="$(cd "$(dirname "$0")/.." && pwd)/assets/works"
declare -A MAP=( ["360作品"]="360" ["百安居作品"]="baanju" ["派欧云作品"]="paiouyun" ["微盟作品"]="weimob" ["众安作品"]="zhongan" ["自己接单作品"]="freelance" ["IP形象设计作品"]="ip" ["logo设计作品"]="logo" )
for src in "${!MAP[@]}"; do
  out="$OUT_ROOT/${MAP[$src]}"
  mkdir -p "$out"
  i=1
  for f in "$SRC_ROOT/$src"/*.{png,jpg,jpeg}; do
    [ -e "$f" ] || continue
    case "$f" in *.DS_Store) continue;; esac
    target="$out/$i.webp"
    if [ ! -f "$target" ] || [ "$f" -nt "$target" ]; then
      cwebp -quiet -q 80 -resize 1600 0 "$f" -o "$target"
    fi
    i=$((i+1))
  done
done
echo "done: WebP files in $OUT_ROOT"
```

- [ ] **Step 2: 运行并验证输出**

Run:
```bash
chmod +x tools/convert-images.sh && ./tools/convert-images.sh
find assets/works -name '*.webp' | wc -l   # 期望 72
```
Expected: 72 个 webp 文件（360×6、baanju×8、paiouyun×11、weimob×10、zhongan×9、freelance×14、ip×3、logo×11）。

- [ ] **Step 3: Commit**

```bash
git add tools assets/works
git commit -m "feat: add webp works images and conversion script"
```

---

### Task 2: portfolio.json 数据文件

**Files:**
- Create: `portfolio.json`

**Interfaces:**
- Produces: `portfolio.json` 顶层对象含 `"categories"` 数组；每项字段 `id/name/type/company/description/year/tags/cover/images`
- `cover` 为 `assets/works/<id>/1.webp`；`images` 为该分类全部 `<n>.webp` 路径（与磁盘实际文件一一对应）

- [ ] **Step 1: 编写 portfolio.json**

按「分类数据约定」字段填充，images 列出该目录全部文件路径。示例结构（完整内容由执行者按 72 文件实际补齐）：

```json
{
  "categories": [
    {
      "id": "360",
      "name": "360 作品",
      "type": "软件产品设计",
      "company": "奇虎360",
      "description": "负责 360 安全卫士体验设计，服务数亿用户的安全软件界面优化。",
      "year": "2014–2017",
      "tags": ["软件产品", "千万级用户"],
      "cover": "assets/works/360/1.webp",
      "images": [
        "assets/works/360/1.webp",
        "assets/works/360/2.webp",
        "assets/works/360/3.webp",
        "assets/works/360/4.webp",
        "assets/works/360/5.webp",
        "assets/works/360/6.webp"
      ]
    }
  ]
}
```

- [ ] **Step 2: 验证 JSON 语法**

Run: `node -e "const d=require('./portfolio.json'); console.log('categories:', d.categories.length, d.categories.map(c=>c.id).join(','))"`
Expected: `categories: 8 360,baanju,paiouyun,weimob,zhongan,freelance,ip,logo`

- [ ] **Step 3: Commit**

```bash
git add portfolio.json
git commit -m "feat: add portfolio data (8 categories)"
```

---

### Task 3: 测试套件（TDD — 先写测试，此刻应当失败）

**Files:**
- Create: `package.json`
- Create: `tests/portfolio.test.mjs`
- Create: `tests/seo.test.mjs`
- Create: `tests/css.test.mjs`

**Interfaces:**
- Produces: `npm test` → 运行 `node --test tests/`（package.json 加 `"test": "node --test tests/"`）
- Task 4/5/6 需让这些测试全部转绿

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "wuhongliang-portfolio",
  "version": "1.0.0",
  "private": true,
  "type": "commonjs",
  "scripts": {
    "test": "node --test tests/",
    "serve": "python3 -m http.server 8000"
  }
}
```

- [ ] **Step 2: 编写 portfolio.test.mjs**

数据完整性 + 文件存在性测试（使用 `node:fs` `node:path`）：

```js
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(fs.readFileSync(path.join(root, "portfolio.json"), "utf8"));
const EXPECTED_IDS = ["360", "baanju", "paiouyun", "weimob", "zhongan", "freelance", "ip", "logo"];
const REQUIRED = ["id", "name", "type", "company", "description", "year", "tags", "cover", "images"];

test("portfolio.json has exactly the 8 expected categories", () => {
  assert.ok(Array.isArray(data.categories));
  assert.equal(data.categories.length, 8);
  assert.deepEqual(data.categories.map((c) => c.id), EXPECTED_IDS);
});

test("every category has all required fields, non-empty", () => {
  for (const c of data.categories) {
    for (const field of REQUIRED) {
      assert.ok(c[field] !== undefined && c[field] !== "", `category ${c.id} missing ${field}`);
    }
    assert.ok(Array.isArray(c.tags) && c.tags.length > 0, `category ${c.id} tags empty`);
    assert.ok(Array.isArray(c.images) && c.images.length > 0, `category ${c.id} images empty`);
  }
});

test("every image path exists on disk and cover is first image", () => {
  for (const c of data.categories) {
    assert.ok(fs.existsSync(path.join(root, c.cover)), `cover missing: ${c.cover}`);
    assert.equal(c.cover, c.images[0], `cover must be images[0] for ${c.id}`);
    for (const img of c.images) {
      assert.ok(fs.existsSync(path.join(root, img)), `image missing: ${img}`);
      assert.ok(img.endsWith(".webp"), `not webp: ${img}`);
    }
  }
});
```

- [ ] **Step 3: 编写 seo.test.mjs**

```js
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

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

test("semantic structure: header/nav/main/footer and section/article/figure", () => {
  for (const tag of ["<header", "<nav", "<main", "<footer", "<section", "<article", "<figure"]) {
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
  for (const text of ["关于我", "我的作品集", "设计能力", "我的生活与爱好", "联系方式"]) {
    assert.match(html, new RegExp(`<h2[^>]*>[\\s\\S]*?${text}`), `missing h2: ${text}`);
  }
});

test("every static img has alt; content lazy flag present in script.js", () => {
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  imgs.forEach((img, i) => {
    assert.match(img, /alt="/, `img#${i} missing alt`);
  });
  const script = fs.readFileSync(path.join(root, "script.js"), "utf8");
  assert.match(script, /loading="lazy"/, "script.js should render lazy images");
});

test("portfolio is JSON-driven: folderGrid + modal present", () => {
  assert.ok(html.includes('id="folderGrid"'));
  assert.ok(html.includes('id="workModal"'));
  assert.ok(html.includes('fetch("portfolio.json")') || html.includes('fetch(\'portfolio.json\''), "script.js fetches portfolio.json");
});

test("robots.txt and sitemap.xml exist", () => {
  assert.ok(fs.existsSync(path.join(root, "robots.txt")));
  assert.ok(fs.existsSync(path.join(root, "sitemap.xml")));
});
```

- [ ] **Step 4: 编写 css.test.mjs**

```js
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

test("css defines design tokens", () => {
  for (const token of ["--bg", "--ink", "--muted", "--accent", "--border", "--surface", "--accent-soft"]) {
    assert.ok(css.includes(token), `missing token ${token}`);
  }
});

test("responsive breakpoints exist (mobile/tablet)", () => {
  assert.match(css, /@media \(max-width:\s*767px\)/);
  assert.match(css, /@media \(max-width:\s*1023px\)/);
});

test("folder-scene classes defined", () => {
  for (const cls of ["folder-grid", "folder-card", "folder-scene", "folder-back", "folder-front", "folder-photo"]) {
    assert.ok(css.includes(cls), `missing class ${cls}`);
  }
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
```

- [ ] **Step 5: 运行测试确认它们失败（尚未创建 index.html/style.css）**

Run: `npm test`
Expected: FAIL（报错 `index.html` 不存在 / `style.css` 不存在）。这是 TDD 预期的红灯。

- [ ] **Step 6: Commit**

```bash
git add package.json tests
git commit -m "test: add static test suite for data, seo, css"
```

---

### Task 4: index.html 完整实现

**Files:**
- Create: `index.html`

**Interfaces:**
- Consumes: `portfolio.json` 分类数据（fetch 渲染）
- Produces: 语义化单页；`<div class="folder-grid" id="folderGrid">`（JS 填充）、`<div class="modal" id="workModal">`（JS 控制）、`.reveal` 元素（JS 观察）
- 依赖 Task 5 的 `style.css`（本任务 HTML 引用之）+ Task 6 的 `script.js`

- [ ] **Step 1: 编写 index.html 头与全局结构**

包含：doctype、`<html lang="zh-CN">`、完整 head（viewport、title、description、keywords、canonical、theme-color、favicon `<link rel="icon" href="assets/icons/favicon.svg">`、OG/Twitter、`<link rel="stylesheet" href="style.css">`、JSON-LD Person schema、preconnect Google Fonts + Inter stylesheet + `display=swap`）。

Person JSON-LD（其后追加 ItemList，把 8 个分类作品暴露给爬虫）：

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "武红亮",
  "alternateName": "Wu Hongliang",
  "jobTitle": "UI/UX 设计师 & AIGC 设计师",
  "description": "14年UI/UX设计经验，曾任职360、众安保险、微盟。专注AI设计、互联网产品体验设计、网站设计和AIGC创意。",
  "email": "mailto:wuhongliang55@163.com",
  "worksFor": ["奇虎360", "众安在线", "微盟"],
  "knowsAbout": ["UI设计", "UX设计", "AIGC设计", "Web设计", "品牌设计", "数字人设计"]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "武红亮的作品集",
  "numberOfItems": 8,
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "360 作品", "url": "#portfolio" },
    { "@type": "ListItem", "position": 2, "name": "百安居作品", "url": "#portfolio" },
    { "@type": "ListItem", "position": 3, "name": "派欧云作品", "url": "#portfolio" },
    { "@type": "ListItem", "position": 4, "name": "微盟作品", "url": "#portfolio" },
    { "@type": "ListItem", "position": 5, "name": "众安作品", "url": "#portfolio" },
    { "@type": "ListItem", "position": 6, "name": "自己接单作品", "url": "#portfolio" },
    { "@type": "ListItem", "position": 7, "name": "IP 形象设计作品", "url": "#portfolio" },
    { "@type": "ListItem", "position": 8, "name": "Logo 设计作品", "url": "#portfolio" }
  ]
}
</script>
```

- [ ] **Step 2: 编写 header/nav/mobile menu**

```html
<header class="site-header" id="site-header">
  <nav class="nav-shell" aria-label="主导航">
    <a class="brand" href="#hero"><span class="brand-mark">武</span><span>武红亮<span class="brand-en">Wu Hongliang</span></span></a>
    <div class="nav-links">
      <a href="#about">关于</a>
      <a href="#portfolio">作品</a>
      <a href="#skills">能力</a>
      <a href="#life">生活</a>
      <a href="#contact">联系</a>
    </div>
    <a class="button button-dark nav-contact" href="#contact">联系合作</a>
    <button class="menu-toggle" id="menuToggle" type="button" aria-label="打开菜单" aria-expanded="false" aria-controls="mobileMenu"><span></span><span></span><span></span></button>
    <div class="mobile-menu" id="mobileMenu" hidden>
      <a href="#about">关于</a><a href="#portfolio">作品</a><a href="#skills">能力</a><a href="#life">生活</a><a href="#contact">联系</a>
    </div>
  </nav>
</header>
```

- [ ] **Step 3: 编写 Hero**

```html
<section class="hero" id="hero" aria-labelledby="hero-title">
  <div class="hero-outline" aria-hidden="true">WU HONGLIANG</div>
  <div class="hero-inner">
    <div class="hero-copy">
      <p class="hero-tag reveal"><span class="pulse-dot"></span>AIGC 时代设计师 · 14 年经验</p>
      <h1 id="hero-title" class="hero-title reveal">你好，我是<span class="hero-name">武红亮</span><span class="hero-role">AIGC 时代的 UI/UX 设计师</span></h1>
      <p class="hero-subtitle reveal">14 年设计经验，专注互联网产品体验设计、AI 辅助设计、品牌视觉设计。</p>
      <div class="hero-actions reveal">
        <a class="button button-dark" href="#portfolio">查看作品集</a>
        <a class="button button-light" href="#contact">联系合作</a>
      </div>
    </div>
    <figure class="hero-visual reveal">
      <img src="assets/avatar.svg" alt="武红亮 个人形象占位" width="360" height="460" />
    </figure>
  </div>
</section>
```

- [ ] **Step 4: 编写 关于我 section**

```html
<section class="section about-section" id="about" aria-labelledby="about-title">
  <div class="container">
    <div class="section-heading reveal">
      <p class="eyebrow">ABOUT</p>
      <h2 id="about-title">关于我</h2>
    </div>
    <div class="about-grid">
      <p class="about-lead reveal">14 年设计行业经验，横跨<mark>品牌设计</mark>、<mark>互联网产品设计</mark>、<mark>软件产品设计</mark>与<mark>AIGC 设计</mark>。曾服务 <strong>360、众安保险、微盟</strong>。</p>
      <p class="about-note reveal">传统设计能力与 AI 时代设计工作流的结合者——既能从 0 到 1 打磨产品体验，也深度实践 AIGC 图片生成、数字人设计与 Vibe Coding，探索设计师的下一个边界。</p>
      <div class="stats reveal">
        <div class="stat"><b>14+</b><span>年设计经验</span></div>
        <div class="stat"><b>3</b><span>家头部企业服务</span></div>
        <div class="stat"><b>千万</b><span>级用户产品</span></div>
        <div class="stat"><b>AIGC</b><span>深度实践者</span></div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 5: 编写 作品集 section（文件夹容器 + 降级 + 弹窗）**

```html
<section class="section portfolio-section" id="portfolio" aria-labelledby="portfolio-title">
  <div class="container">
    <div class="section-heading reveal">
      <p class="eyebrow">SELECTED WORKS</p>
      <h2 id="portfolio-title">我的作品集</h2>
      <p>点击文件夹，查看每一类的设计作品。</p>
    </div>
    <div class="folder-grid" id="folderGrid" aria-busy="true">
      <p class="folder-loading">正在加载作品…</p>
    </div>
  </div>
</section>

<div class="modal" id="workModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle" hidden>
  <div class="modal-backdrop" data-modal-close></div>
  <div class="modal-card">
    <button class="modal-close" type="button" data-modal-close aria-label="关闭">×</button>
    <div class="modal-head">
      <p class="eyebrow" id="modalType"></p>
      <h2 id="modalTitle"></h2>
      <p class="modal-desc" id="modalDesc"></p>
      <div class="modal-meta" id="modalMeta"></div>
    </div>
    <div class="modal-viewer">
      <button class="modal-arrow modal-prev" type="button" aria-label="上一张">←</button>
      <figure class="modal-figure">
        <img id="modalImg" src="" alt="" loading="lazy" />
        <figcaption id="modalCounter">1 / 1</figcaption>
      </figure>
      <button class="modal-arrow modal-next" type="button" aria-label="下一张">→</button>
    </div>
  </div>
</div>
```

- [ ] **Step 6: 编写 设计能力 / 生活 / 联系方式 / footer**

设计能力（静态标签，分组）：

```html
<section class="section skills-section" id="skills" aria-labelledby="skills-title">
  <div class="container">
    <div class="section-heading reveal">
      <p class="eyebrow">CAPABILITIES</p>
      <h2 id="skills-title">设计能力</h2>
    </div>
    <div class="skills-groups reveal">
      <div class="skill-group"><h3>产品体验</h3><div class="skill-tags"><span>UI/UX 设计</span><span>Web 设计</span><span>APP 设计</span><span>B 端产品</span></div></div>
      <div class="skill-group"><h3>AIGC 与新技术</h3><div class="skill-tags"><span>AIGC 设计</span><span>AI 图片生成</span><span>数字人设计</span></div></div>
      <div class="skill-group"><h3>视觉与品牌</h3><div class="skill-tags"><span>品牌设计</span><span>视觉设计</span></div></div>
    </div>
  </div>
</section>
```

生活（占位，无照片则纯文字卡片 + 标签）：

```html
<section class="section life-section" id="life" aria-labelledby="life-title">
  <div class="container">
    <div class="section-heading reveal">
      <p class="eyebrow">LIFE &amp; INTERESTS</p>
      <h2 id="life-title">我的生活与爱好</h2>
      <p>设计之外的自己。</p>
    </div>
    <div class="life-grid reveal">
      <article class="life-card"><span class="life-emoji">📷</span><h3>摄影</h3><p>记录光线与日常细节。</p></article>
      <article class="life-card"><span class="life-emoji">✈️</span><h3>旅行</h3><p>在路上收集灵感。</p></article>
      <article class="life-card"><span class="life-emoji">🤖</span><h3>AI 实验</h3><p>用 AIGC 工具做设计实验。</p></article>
      <article class="life-card"><span class="life-emoji">🧊</span><h3>Blender</h3><p>三维建模与渲染练习。</p></article>
      <article class="life-card"><span class="life-emoji">🎬</span><h3>视频创作</h3><p>短视频策划与制作。</p></article>
      <article class="life-card"><span class="life-emoji">📓</span><h3>生活记录</h3><p>把日常写成素材。</p></article>
    </div>
  </div>
</section>
```

联系方式：

```html
<section class="section contact-section" id="contact" aria-labelledby="contact-title">
  <div class="container">
    <div class="contact-heading reveal">
      <p class="eyebrow">CONTACT</p>
      <h2 id="contact-title">联系方式</h2>
      <p>期待与你聊聊设计与合作。</p>
    </div>
    <div class="contact-grid reveal">
      <button class="contact-cell" id="copyWechat" type="button" data-copy="18901962352">
        <small>微信 · 复制号</small><strong>189 0196 2352</strong><span class="copy-tip">已复制 ✓</span>
      </button>
      <a class="contact-cell" href="mailto:wuhongliang55@163.com">
        <small>邮箱 Email</small><strong>wuhongliang55@163.com</strong>
      </a>
      <div class="contact-cell"><small>城市 Location</small><strong>上海 · China</strong></div>
    </div>
    <div class="contact-cta reveal">
      <a class="button button-dark" href="mailto:wuhongliang55@163.com">预约设计合作 →</a>
    </div>
  </div>
</section>

<footer class="site-footer">
  <div class="container footer-inner">
    <p>© 2026 武红亮 · UI/UX &amp; AIGC 设计师 — 上海</p>
    <a href="#hero">回到顶部 ↑</a>
  </div>
</footer>
```

- [ ] **Step 7: 页尾引入 script.js + toast**

```html
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<script src="script.js" defer></script>
```

- [ ] **Step 8: 运行测试（部分红灯转绿）**

Run: `npm test`
Expected: seo 测试仍需 `style.css`/`robots.txt`/`sitemap.xml`，故仍有失败；portfolio 测试已绿（数据在）。接受剩余红灯，进入 Task 5。

- [ ] **Step 9: Commit**

```bash
git add index.html
git commit -m "feat: add semantic single-page index.html"
```

---

### Task 5: style.css 完整实现

**Files:**
- Create: `style.css`

**Interfaces:**
- Consumes: Task 4 的 HTML class 名
- Produces: 全部样式（设计令牌、布局、folder-scene、响应式、reduced-motion）
- Task 3 css.test.mjs 需转绿：8 个令牌、767px/1023px 断点、folder-* 类、grid/flex、aspect-ratio、prefers-reduced-motion

- [ ] **Step 1: 设计令牌 + 基础重置**

```css
:root {
  --bg: #f7f6f3;
  --surface: #ffffff;
  --surface-soft: #efeeea;
  --ink: #191919;
  --muted: #76706a;
  --accent: #6f5bd1;
  --accent-soft: #ece8f8;
  --border: #e6e4e0;
  --container: 1180px;
  --ease: cubic-bezier(.16, 1, .3, 1);
  --radius: 16px;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; scroll-padding-top: 78px; }
body { font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif; color: var(--ink); background: var(--bg); line-height: 1.7; -webkit-font-smoothing: antialiased; }
img { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }
button { font: inherit; color: inherit; background: none; border: 0; cursor: pointer; }
:focus-visible { outline: 3px solid rgba(111, 91, 209, .35); outline-offset: 3px; }
.container { width: min(var(--container), 100% - 48px); margin-inline: auto; }
.en { font-family: "Inter", "Helvetica Neue", Arial, sans-serif; }
```

- [ ] **Step 2: 通用 section / button / 进场**

```css
.section { padding: 120px 0; }
.section-heading { max-width: 720px; }
.section-heading h2 { font-size: clamp(32px, 4vw, 50px); font-weight: 600; letter-spacing: -.04em; line-height: 1.1; margin-bottom: 14px; }
.section-heading > p:last-child { color: var(--muted); font-size: 15px; max-width: 58ch; }
.eyebrow { color: var(--accent); font-size: 11px; font-weight: 600; letter-spacing: .16em; }
.button { display: inline-flex; min-height: 46px; align-items: center; justify-content: center; gap: 10px; padding: 11px 22px; border-radius: 999px; font-size: 14px; font-weight: 500; transition: transform .3s var(--ease), background .3s, box-shadow .3s; }
.button:hover { transform: translateY(-2px); }
.button-dark { color: #fff; background: var(--ink); }
.button-dark:hover { background: #303136; box-shadow: 0 10px 26px rgba(25,25,25,.18); }
.button-light { color: var(--ink); background: rgba(255,255,255,.6); border: 1px solid rgba(25,25,25,.16); }
.button-light:hover { background: #fff; border-color: rgba(25,25,25,.3); }
.reveal { opacity: 0; transform: translateY(24px); transition: opacity .7s ease, transform .7s var(--ease); }
.reveal.is-visible { opacity: 1; transform: none; }
mark { background: linear-gradient(transparent 60%, rgba(111,91,209,.28) 60%); padding: 0 .1em; color: inherit; }
```

- [ ] **Step 3: Header / nav / mobile**

```css
.site-header { position: fixed; inset: 0 0 auto; z-index: 40; height: 64px; transition: background .3s, box-shadow .3s; }
.site-header.is-scrolled { background: rgba(247,246,243,.85); box-shadow: 0 1px 0 var(--border); backdrop-filter: blur(16px); }
.nav-shell { position: relative; display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 24px; width: min(var(--container), 100% - 48px); height: 64px; margin-inline: auto; }
.brand { display: inline-flex; align-items: center; gap: 10px; font-weight: 700; font-size: 16px; }
.brand-mark { display: grid; width: 34px; height: 34px; place-items: center; color: #fff; background: var(--ink); border-radius: 10px; }
.brand-en { display: block; font-size: 10px; letter-spacing: .18em; color: var(--muted); font-weight: 500; }
.nav-links { display: flex; align-items: center; gap: 30px; color: var(--muted); font-size: 14px; }
.nav-links a { position: relative; transition: color .25s; }
.nav-links a::after { content: ""; position: absolute; left: 0; right: 0; bottom: -6px; height: 1px; background: var(--ink); transform: scaleX(0); transition: transform .3s var(--ease); }
.nav-links a:hover { color: var(--ink); }
.nav-links a:hover::after { transform: scaleX(1); }
.nav-contact { justify-self: end; }
.menu-toggle, .mobile-menu { display: none; }
```

- [ ] **Step 4: Hero**

```css
.hero { position: relative; min-height: 92svh; display: flex; align-items: center; overflow: hidden; padding: 110px 0 60px; }
.hero-outline { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-family: "Inter", sans-serif; font-weight: 800; font-size: clamp(80px, 18vw, 220px); letter-spacing: .02em; color: transparent; -webkit-text-stroke: 1px rgba(25,25,25,.08); white-space: nowrap; user-select: none; pointer-events: none; z-index: 0; }
.hero-inner { position: relative; z-index: 1; width: min(1180px, 100% - 48px); margin-inline: auto; display: grid; grid-template-columns: 1.4fr .6fr; gap: 60px; align-items: center; }
.hero-tag { display: inline-flex; align-items: center; gap: 9px; padding: 6px 12px; color: #52437f; background: rgba(255,255,255,.5); border: 1px solid rgba(111,91,209,.16); border-radius: 999px; font-size: 12px; }
.pulse-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); animation: pulse 2.2s infinite; }
@keyframes pulse { 50% { opacity: .4; transform: scale(.7); } }
.hero-title { margin-top: 22px; font-size: clamp(30px, 4vw, 48px); font-weight: 600; letter-spacing: -.045em; line-height: 1.15; }
.hero-name { display: block; font-size: clamp(52px, 8vw, 88px); font-weight: 700; letter-spacing: -.02em; margin: 6px 0; }
.hero-role { display: block; color: var(--accent); font-size: clamp(20px, 2.4vw, 28px); font-weight: 500; }
.hero-subtitle { margin-top: 20px; color: var(--muted); font-size: 16px; max-width: 46ch; }
.hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 32px; }
.hero-visual { position: relative; margin: 0; }
.hero-visual img { width: 100%; max-width: 360px; border-radius: var(--radius); box-shadow: 0 30px 60px -30px rgba(25,25,25,.4); }
```

- [ ] **Step 5: 关于 / 统计**

```css
.about-grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: clamp(32px, 5vw, 72px); align-items: center; margin-top: 40px; }
.about-lead { font-size: clamp(18px, 2.2vw, 24px); line-height: 1.8; font-weight: 500; }
.about-note { margin-top: 20px; color: var(--muted); font-size: 15px; max-width: 60ch; }
.stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
.stat { background: var(--surface); padding: 26px 22px; display: grid; gap: 6px; }
.stat b { font-size: clamp(22px, 3vw, 34px); font-weight: 700; letter-spacing: -.02em; }
.stat span { color: var(--muted); font-size: 13px; }
```

- [ ] **Step 6: 作品集 — folder-scene 核心（liuliulab 适配）+ 弹窗**

```css
.portfolio-section { background: var(--surface); border-block: 1px solid var(--border); }
.folder-grid { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); align-items: start; gap: 0; min-height: 480px; margin-top: 56px; }
.folder-card { display: block; width: 100%; padding: 0; text-align: left; background: none; border: 0; cursor: pointer; transform-origin: center bottom; transition: transform .55s var(--ease); }
.folder-card:nth-child(1) { grid-column: 1 / 6; transform: translate(-16px, 48px) rotate(-2.2deg); }
.folder-card:nth-child(2) { grid-column: 5 / 9; transform: translate(10px, 104px) rotate(1.5deg); }
.folder-card:nth-child(3) { grid-column: 9 / 13; transform: translate(14px, 10px) rotate(-1deg); }
.folder-card:nth-child(4) { grid-column: 1 / 5; transform: translate(6px, -6px) rotate(1.2deg); }
.folder-card:nth-child(5) { grid-column: 4 / 8; transform: translate(2px, 40px) rotate(-1.4deg); }
.folder-card:nth-child(6) { grid-column: 8 / 13; transform: translate(12px, -18px) rotate(1.8deg); }
.folder-card:nth-child(7) { grid-column: 2 / 6; transform: translate(-10px, 10px) rotate(-1.6deg); }
.folder-card:nth-child(8) { grid-column: 7 / 12; transform: translate(16px, 34px) rotate(1.3deg); }
.folder-card:hover, .folder-card[aria-expanded="true"], .folder-card:focus-visible { z-index: 4; }
.folder-scene { position: relative; display: block; height: 400px; perspective: 900px; }
.folder-back, .folder-front { position: absolute; left: 6%; right: 6%; bottom: 18px; display: block; border-radius: 16px; }
.folder-back { z-index: 2; height: 178px; background: #dcdbd6; border: 1px solid rgba(25,25,25,.06); box-shadow: 0 18px 34px rgba(25,25,25,.1); transition: transform .58s var(--ease); }
.folder-back::before { content: ""; position: absolute; left: 0; top: -32px; width: 42%; height: 54px; background: inherit; border-radius: 14px 20px 0 0; }
.folder-front { z-index: 8; height: 152px; padding: 48px 22px 18px; color: var(--ink); background: linear-gradient(155deg, #f4f4f1, #e2e1dc); border: 1px solid rgba(255,255,255,.85); box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 18px 34px rgba(25,25,25,.1); transform-origin: center bottom; transition: transform .58s var(--ease); }
.folder-front b { position: absolute; right: 20px; top: 18px; font-family: "Inter", sans-serif; font-size: 10px; color: rgba(25,25,25,.5); }
.folder-front strong, .folder-front small { display: block; }
.folder-front strong { font-size: 22px; font-weight: 600; letter-spacing: -.02em; }
.folder-front small { margin-top: 3px; color: var(--muted); font-size: 11px; }
.folder-photo { position: absolute; z-index: 5; left: 50%; bottom: 110px; width: 56%; padding: 6px; overflow: hidden; background: #fff; border: 1px solid rgba(25,25,25,.1); border-radius: 10px; box-shadow: 0 16px 28px rgba(25,25,25,.16); transform: translate(-50%, 56px) rotate(0) scale(.82); transform-origin: center bottom; transition: transform .68s var(--ease); }
.folder-photo img { width: 100%; aspect-ratio: 4/3; object-fit: cover; border-radius: 6px; background: var(--surface-soft); }
.folder-photo.photo-two { transform: translate(-50%, 64px) rotate(2deg) scale(.8); }
.folder-photo.photo-three { transform: translate(-50%, 70px) rotate(-2deg) scale(.78); }
.folder-photo.photo-four { transform: translate(-50%, 74px) scale(.76); }
.folder-card:hover .folder-back, .folder-card[aria-expanded="true"] .folder-back { transform: translateY(-6px) rotateX(4deg); }
.folder-card:hover .folder-front, .folder-card[aria-expanded="true"] .folder-front { transform: translateY(12px) rotateX(-11deg); }
.folder-card:hover .photo-one, .folder-card[aria-expanded="true"] .photo-one { transform: translate(-103%, -88px) rotate(-9deg) scale(1); }
.folder-card:hover .photo-two, .folder-card[aria-expanded="true"] .photo-two { transform: translate(-50%, -132px) rotate(2deg) scale(1.03); }
.folder-card:hover .photo-three, .folder-card[aria-expanded="true"] .photo-three { transform: translate(3%, -86px) rotate(9deg) scale(1); }
.folder-card:hover .photo-four, .folder-card[aria-expanded="true"] .photo-four { transform: translate(-48%, -50px) rotate(-1deg) scale(.9); }
@media (prefers-reduced-motion: no-preference) {
  .folder-card:not(:hover):not([aria-expanded="true"]) .folder-scene { animation: folder-float 5s ease-in-out infinite; }
  .folder-card:nth-child(2n) .folder-scene { animation-delay: -1.7s; }
  .folder-card:nth-child(3n) .folder-scene { animation-delay: -3.1s; }
}
@keyframes folder-float { 50% { transform: translateY(-7px); } }
.folder-loading { grid-column: 1 / -1; color: var(--muted); font-size: 14px; text-align: center; padding: 60px 0; }

.modal { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; }
.modal[hidden] { display: none; }
.modal-backdrop { position: absolute; inset: 0; background: rgba(25,25,25,.72); backdrop-filter: blur(6px); }
.modal-card { position: relative; z-index: 1; width: min(920px, calc(100vw - 40px)); max-height: 88svh; overflow: auto; background: var(--bg); border-radius: 20px; box-shadow: 0 40px 90px rgba(0,0,0,.4); padding: 34px; }
.modal-close { position: absolute; top: 16px; right: 16px; width: 40px; height: 40px; border-radius: 50%; font-size: 22px; color: var(--muted); background: var(--surface-soft); }
.modal-head h2 { font-size: 26px; letter-spacing: -.03em; margin: 8px 0 6px; }
.modal-desc { color: var(--muted); font-size: 14px; max-width: 60ch; }
.modal-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
.modal-meta span { font-size: 11px; color: var(--accent); background: var(--accent-soft); border: 1px solid rgba(111,91,209,.14); padding: 5px 9px; border-radius: 7px; }
.modal-viewer { position: relative; margin-top: 22px; }
.modal-figure img { width: 100%; max-height: 58svh; object-fit: contain; border-radius: 12px; background: var(--surface); }
.modal-figure figcaption { text-align: center; color: var(--muted); font-size: 12px; margin-top: 10px; font-family: "Inter", sans-serif; }
.modal-arrow { position: absolute; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 50%; color: var(--ink); background: rgba(255,255,255,.92); box-shadow: 0 10px 24px rgba(0,0,0,.2); font-size: 18px; }
.modal-prev { left: -14px; } .modal-next { right: -14px; }
@media (max-width: 700px) { .modal-card { padding: 24px 16px; } .modal-prev { left: 4px; } .modal-next { right: 4px; } }
```

- [ ] **Step 7: 能力 / 生活 / 联系 / footer**

```css
.skills-section { background: #fbfaf8; }
.skills-groups { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px; margin-top: 40px; }
.skill-group { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 26px 24px; transition: transform .4s var(--ease), box-shadow .4s; }
.skill-group:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -20px rgba(25,25,25,.18); }
.skill-group h3 { font-size: 16px; font-weight: 600; margin-bottom: 16px; }
.skill-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.skill-tags span { padding: 7px 12px; font-size: 13px; color: var(--accent); background: var(--accent-soft); border: 1px solid rgba(111,91,209,.16); border-radius: 999px; }

.life-section .life-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-top: 40px; }
.life-card { padding: 30px 24px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); transition: transform .4s var(--ease), box-shadow .4s; }
.life-card:hover { transform: translateY(-5px); box-shadow: 0 22px 44px -22px rgba(25,25,25,.2); }
.life-emoji { font-size: 28px; }
.life-card h3 { margin: 14px 0 6px; font-size: 18px; font-weight: 600; }
.life-card p { color: var(--muted); font-size: 13px; }

.contact-section { background: var(--ink); color: #fff; }
.contact-section .section-heading > p:last-child, .contact-section .eyebrow { color: #b9b0e8; }
.contact-section h2 { color: #fff; }
.contact-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: rgba(255,255,255,.14); border: 1px solid rgba(255,255,255,.14); border-radius: var(--radius); overflow: hidden; margin-top: 40px; }
.contact-cell { display: grid; gap: 4px; padding: 26px 22px; background: var(--ink); color: #fff; text-align: left; transition: background .3s; }
.contact-cell:hover { background: #26242a; }
.contact-cell small { color: rgba(255,255,255,.5); font-size: 11px; letter-spacing: .1em; }
.contact-cell strong { font-size: 18px; font-weight: 600; }
.copy-tip { color: #b9aae6; font-size: 12px; opacity: 0; transition: opacity .3s; }
.copied .copy-tip { opacity: 1; }
.contact-cta { margin-top: 34px; }
.contact-cta .button-dark { background: var(--accent); }
.contact-cta .button-dark:hover { background: #5c49bd; }

.site-footer { background: var(--ink); color: rgba(255,255,255,.5); border-top: 1px solid rgba(255,255,255,.1); }
.footer-inner { display: flex; justify-content: space-between; gap: 16px; align-items: center; padding: 28px 0; font-size: 12px; }
.footer-inner a { color: rgba(255,255,255,.8); }

.toast { position: fixed; left: 50%; bottom: 26px; z-index: 200; padding: 11px 18px; color: #fff; background: rgba(25,25,25,.92); border-radius: 10px; font-size: 13px; opacity: 0; transform: translate(-50%, 12px); pointer-events: none; transition: opacity .3s, transform .3s var(--ease); }
.toast.is-visible { opacity: 1; transform: translate(-50%, 0); }
```

- [ ] **Step 8: 响应式 + reduced-motion**

```css
@media (max-width: 1023px) {
  .section { padding: 96px 0; }
  .hero-inner { grid-template-columns: 1fr; gap: 32px; }
  .hero-visual img { max-width: 260px; }
  .about-grid { grid-template-columns: 1fr; gap: 34px; }
  .folder-grid { grid-template-columns: repeat(2, 1fr); min-height: auto; }
  .folder-card:nth-child(n) { grid-column: auto; transform: translateY(16px) rotate(-1deg); }
  .folder-card:nth-child(2n) { transform: translateY(48px) rotate(1deg); }
  .contact-grid { grid-template-columns: 1fr; }
}
@media (max-width: 767px) {
  .section { padding: 76px 0; }
  .container { width: min(100% - 40px, var(--container)); }
  .nav-shell { grid-template-columns: auto auto; }
  .nav-links, .nav-contact { display: none; }
  .menu-toggle { display: grid; width: 40px; height: 40px; place-content: center; gap: 5px; border: 1px solid var(--border); border-radius: 10px; background: rgba(255,255,255,.7); }
  .menu-toggle span { display: block; width: 17px; height: 1.5px; background: var(--ink); }
  .mobile-menu { position: absolute; top: 60px; right: 0; display: grid; gap: 2px; width: 180px; padding: 10px; background: rgba(255,255,255,.97); border: 1px solid var(--border); border-radius: 14px; box-shadow: 0 18px 40px rgba(25,25,25,.14); }
  .mobile-menu[hidden] { display: none; }
  .mobile-menu a { padding: 10px 12px; border-radius: 8px; font-size: 14px; }
  .hero { min-height: 100svh; align-items: flex-start; padding: 120px 0 40px; }
  .hero-title { font-size: 26px; }
  .hero-name { font-size: 46px; }
  .hero-role { font-size: 20px; }
  .hero-actions .button { padding-inline: 16px; min-height: 44px; font-size: 13px; }
  .folder-grid { grid-template-columns: 1fr; }
  .folder-card:nth-child(n), .folder-card:nth-child(2n) { transform: none; }
  .folder-scene { height: 360px; }
  .footer-inner { flex-direction: column; align-items: flex-start; gap: 8px; }
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
  .reveal { opacity: 1; transform: none; }
  .folder-scene { animation: none !important; }
}
```

- [ ] **Step 9: 运行测试（css.test 应绿）**

Run: `npm test`
Expected: css.test 全绿；seo.test 仍剩 robots/sitemap 两项红灯（Task 7 处理），HTML 其余测试应绿。

- [ ] **Step 10: Commit**

```bash
git add style.css
git commit -m "feat: add stylesheet with folder-scene and responsive design"
```

---

### Task 6: script.js 交互实现

**Files:**
- Create: `script.js`

**Interfaces:**
- Consumes: `portfolio.json`（fetch）、`#folderGrid`、`#workModal` 及 `#modalTitle/#modalDesc/#modalMeta/#modalType/#modalImg/#modalCounter`
- Produces: 渲染文件夹卡片 → 点击开弹窗 → 前后翻页；IntersectionObserver `.reveal`；header scroll 状态；移动菜单；微信复制 toast

- [ ] **Step 1: 编写 script.js 主体**

```js
(() => {
  "use strict";

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- IntersectionObserver: reveal 进场 ----
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  if (reduceMotion) document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));

  // ---- Header 滚动状态 ----
  const header = document.getElementById("site-header");
  const onScroll = () => header.classList.toggle("is-scrolled", scrollY > 24);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---- 移动菜单 ----
  const toggle = document.getElementById("menuToggle");
  const menu = document.getElementById("mobileMenu");
  toggle.addEventListener("click", () => {
    const open = menu.hidden;
    menu.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
  });
  menu.addEventListener("click", (e) => { if (e.target.tagName === "A") { menu.hidden = true; toggle.setAttribute("aria-expanded", "false"); } });

  // ---- Toast ----
  const toast = document.getElementById("toast");
  let toastT = null;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove("is-visible"), 1800);
  };

  // ---- 微信复制 ----
  const wechatBtn = document.getElementById("copyWechat");
  if (wechatBtn) wechatBtn.addEventListener("click", () => {
    const text = wechatBtn.dataset.copy || "";
    const done = () => { wechatBtn.classList.add("copied"); showToast("微信已复制"); setTimeout(() => wechatBtn.classList.remove("copied"), 1600); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done).catch(done);
    else {
      const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta);
      ta.select(); try { document.execCommand("copy"); } catch (_) {} document.body.removeChild(ta); done();
    }
  });

  // ---- 作品集渲染 ----
  const grid = document.getElementById("folderGrid");
  const modal = document.getElementById("workModal");
  const slides = { imgs: [], idx: 0, length: 0 };
  const $ = (id) => document.getElementById(id);

  // 单个文件的模板（最多展示前 4 张照片 + 正面标签）
  const folderTemplate = (c, photos) => `
    <button class="folder-card" type="button" data-id="${c.id}" aria-expanded="false" aria-label="打开${c.name}">
      <span class="folder-scene">
        ${photos.map((p, i) => `<span class="folder-photo photo-${["one","two","three","four"][i]}"><img src="${p}" alt="${c.name} 作品 ${i + 1}" loading="lazy" width="360" height="270" /></span>`).join("")}
        <span class="folder-back" aria-hidden="true"></span>
        <span class="folder-front"><b>${c.type}</b><strong>${c.name}</strong><small>${c.company} · ${c.year}</small></span>
      </span>
    </button>`;

  // 渲染网格
  const renderGrid = (data) => {
    grid.innerHTML = data.categories.map((c) => folderTemplate(c, c.images.slice(0, 4))).join("");
    grid.setAttribute("aria-busy", "false");
    grid.querySelectorAll(".folder-card").forEach((card) => {
      card.addEventListener("click", () => openModal(card.dataset.id, data.categories));
    });
  };

  // 打开弹窗
  const openModal = (id, cats) => {
    const cat = cats.find((c) => c.id === id);
    if (!cat) return;
    slides.imgs = cat.images;
    slides.length = cat.images.length;
    slides.idx = 0;
    $("modalType").textContent = cat.type;
    $("modalTitle").textContent = cat.name;
    $("modalDesc").textContent = cat.description;
    $("modalMeta").innerHTML = [cat.year, cat.company, ...cat.tags].map((t) => `<span>${t}</span>`).join("");
    renderSlide();
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    $("modalImg").focus();
  };

  const renderSlide = () => {
    $("modalImg").src = slides.imgs[slides.idx];
    $("modalImg").alt = `${$("modalTitle").textContent} 作品 ${slides.idx + 1}`;
    $("modalCounter").textContent = `${slides.idx + 1} / ${slides.length}`;
  };

  const closeModal = () => { modal.hidden = true; document.body.style.overflow = ""; };
  const step = (d) => { slides.idx = (slides.idx + d + slides.length) % slides.length; renderSlide(); };

  modal.querySelectorAll("[data-modal-close]").forEach((el) => el.addEventListener("click", closeModal));
  modal.querySelector(".modal-prev").addEventListener("click", () => step(-1));
  modal.querySelector(".modal-next").addEventListener("click", () => step(1));
  addEventListener("keydown", (e) => {
    if (modal.hidden) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  // ---- 数据加载 ----
  fetch("portfolio.json")
    .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
    .then(renderGrid)
    .catch(() => { grid.innerHTML = '<p class="folder-loading">作品数据加载失败，请稍后刷新重试。</p>'; grid.setAttribute("aria-busy", "false"); });
})();
```

- [ ] **Step 2: 语法校验（静态测试）**

Run: `node --check script.js`
Expected: 无输出（语法正确）。

- [ ] **Step 3: 浏览器冒烟验证**

Run: `python3 -m http.server 8000`（后台），用浏览器/`curl` 验证 `http://localhost:8000` 返回 200 且含 `<div class="folder-grid"`，`portfolio.json`、`style.css`、`script.js` 均 200。
Run: `curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/index.html` 期望 `200`。
（如本机无浏览器自动化，则以 `node --check` + HTTP 200 作为通过标准。）

- [ ] **Step 4: Commit**

```bash
git add script.js
git commit -m "feat: add portfolio rendering, modal, and nav interactions"
```

---

### Task 7: SEO 补充文件（favicon / robots / sitemap / README / .gitignore）

**Files:**
- Create: `assets/icons/favicon.svg`
- Create: `assets/avatar.svg`
- Create: `robots.txt`
- Create: `sitemap.xml`
- Create: `README.md`
- Create: `.gitignore`

**Interfaces:**
- Produces: 满足 seo.test 「robots.txt and sitemap.xml exist」红灯项；为部署提供说明

- [ ] **Step 1: favicon.svg + avatar.svg**

`assets/icons/favicon.svg`：深底圆角方块 + 白「武」。

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#191919"/><text x="50" y="68" font-size="52" text-anchor="middle" fill="#ffffff" font-family="PingFang SC, sans-serif">武</text></svg>
```

`assets/avatar.svg`：浅底 + 抽象「武」字 + 圆角（Hero 占位）。同理生成 360×460 视觉。

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 460"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1eef8"/><stop offset="1" stop-color="#e4e0ec"/></linearGradient></defs><rect width="360" height="460" rx="18" fill="url(#g)"/><text x="180" y="258" font-size="150" text-anchor="middle" fill="#191919" font-family="PingFang SC, sans-serif" font-weight="700">武</text><text x="180" y="330" font-size="22" text-anchor="middle" fill="#76706a" font-family="Inter, sans-serif" letter-spacing="6">WU HONGLIANG</text></svg>
```

- [ ] **Step 2: robots.txt + sitemap.xml**

`robots.txt`：

```
User-agent: *
Allow: /
Sitemap: https://wuhongliang.design/sitemap.xml
```

`robots.txt` 中的域名占位为 `https://wuhongliang.design`（README 中说明部署后按实际域名替换）。

`sitemap.xml`：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://wuhongliang.design/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>
</urlset>
```

- [ ] **Step 3: .gitignore**

```
.DS_Store
node_modules/
```

- [ ] **Step 4: README.md**

包含：项目简介、目录结构、本地运行（`python3 -m http.server 8000` 或 `npm run serve`）、运行测试（`npm test`）、重新生成图片（`./tools/convert-images.sh`）、部署到 Cloudflare Pages / Vercel / GitHub Pages 的分步说明（无构建命令、静态目录）、SEO 说明（替换 robots/sitemap 域名、更新 OG 图片）。

- [ ] **Step 5: 运行完整测试套件**

Run: `npm test`
Expected: 全部通过（portfolio 4 项、seo 12 项、css 6 项）。

- [ ] **Step 6: Commit**

```bash
git add assets/icons assets/avatar.svg robots.txt sitemap.xml .gitignore README.md
git commit -m "feat: add seo assets, robots, sitemap, readme"
```

---

### Task 8: 最终验证（浏览器 + Lighthouse 清单）

**Files:**
- 无新文件（仅验证）

- [ ] **Step 1: 完整测试**

Run: `npm test`
Expected: 全绿。

- [ ] **Step 2: 响应式人工检查清单**

在 1920 / 1440 / 1280 / 430 / 390 / 375 宽度检查：导航不溢出、Hero 标题完整、文件夹卡片不重叠（≤767 单列）、弹窗内图可翻页、`prefers-reduced-motion` 下无动画。

- [ ] **Step 3: Lighthouse 记录**

运行 Lighthouse Mobile/Desktop 截图存档：Performance、SEO 分数。若 Performance < 90 或 SEO < 95，记录瓶颈并做最小修复（例如内联关键 CSS、压缩 avatar SVG、移除阻塞资源）。

- [ ] **Step 4: 最终提交（若有 Lighthouse 修复）**

```bash
git add -A
git commit -m "chore: lighthouse optimization"
```

---

## Self-Review 备忘

- SEO 测试中 title 是精确匹配字符串「武红亮｜UI/UX设计师｜AIGC设计师｜个人作品集」，Task 4 Step 1 必须逐字写入。
- seo.test 要求脚本内含 `fetch("portfolio.json")`（双引号）与 `loading="lazy"` 字样，Task 6 的 script.js 必须逐字满足。
- seo.test「JSON-LD 两端点」要求 `<script type="application/ld+json">` 出现两次（Person + ItemList）；ItemList 必须含 `itemListElement` 数组、长度 8。
- portfolio.test 要求 `cover === images[0]`，Task 2 数据必须满足。
- css.test 要求 767px 与 1023px 断点、`aspect-ratio`、8 个令牌名，Task 5 已覆盖。
- `script.js` 中 `modalImg` 需要在打开时 `focus()`；`renderSlide` 依赖 `slides` 状态。
- 全部作品图由 JS 从 JSON 渲染并带 `loading="lazy"`；静态 HTML 仅含 Hero 头像图（带 alt）。
- 所有 fetch 均为同目录相对路径，天然支持子路径部署（如 gh-pages `/repo/`）。
- 全部图片路径为相对路径（`assets/works/...`），部署到子目录时无需改动。