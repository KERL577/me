# Mark91 深色工作室风 视觉改版 v2 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将已交付的浅色文件夹式个人作品集整体视觉语言切换为 Mark91 式深色工作室风（暖黑底 + 暖金强调 + 超大排版 + 数字编号导航 + 跑马灯 + 计数/展开动效），同时完整保留折叠夹作品集、信息架构、SEO、数据模型与既有 21 项测试。

**Architecture:** 视觉层重构——index.html 调整导航/Hero/关于我/技能/联系结构（新增跑马灯、stats-grid、skill-rows）；style.css 全部 token 换值并新增 marquee/stats-grid/skill-rows/cta 样式 + folder-scene 深色皮肤；script.js 追加统计计数与技能行展开两个小交互，其余逻辑（fetch 渲染、弹窗、复制、菜单、reveal）零改动。

**Tech Stack:** 纯静态 HTML5 + CSS3 + 原生 JS（IIFE）；Node 内置 `node --test` 测试；无任何新依赖、无新字体文件、无新图片。

**Spec:** `docs/superpowers/specs/2026-09-17-portfolio-site-design-v2-mark91.md`（本计划从该规格推导；执行者必须同时阅读规格与本文档。）

## Global Constraints

- 分支 `portfolio-site`；项目根目录 `/Users/wuhongliang/Documents/Default Project/wuhongliang-portfolio`（工作目录）。
- **既有 21 项测试必须持续全绿**：每个任务结束时运行 `npm test` 确认 pass 21、fail 0（新增测试后为 24）。
- 不改动 `portfolio.json`、`assets/works/**`、`robots.txt`、`sitemap.xml`、`favicon.svg`、`avatar.svg`。
- seo 测试硬性逐字要求（不得破坏）：`<html lang="zh-CN"`；`<title>武红亮｜UI/UX设计师｜AIGC设计师｜个人作品集</title>`；唯一个 `h1` 含「武红亮」与「AIGC」；五个 h2 文本「关于我/我的作品集/设计能力/我的生活与爱好/联系方式」；`id="folderGrid"` 与 `id="workModal"`；所有 `<img>` 有 `alt`；script.js 含 `loading="lazy"` 与 `fetch("portfolio.json")`（双引号）；header→nav→main→footer 顺序与 `<section>/<article>/<figure>` 存在。
- css 测试硬性要求：token 名 `--bg --ink --muted --accent --border --surface --accent-soft` 必须全部仍出现在 style.css；`@media (max-width: 767px)` 与 `@media (max-width: 1023px)`；类名 `folder-grid folder-card folder-scene folder-back folder-front folder-photo`；`prefers-reduced-motion\s*:\s*reduce`；`display:grid` 与 `display:flex`；`aspect-ratio`。
- 新增 3 项测试的名称与断言（逐字）见 Task 1，不得自行修改既有测试文件中的任何旧断言。
- 编码行为：中文文案使用全角标点；注释不加中文（与现文件一致，不加注释）；`prefers-reduced-motion` 下所有动效降级。
- 每次 commit 后不再 amend，除非审查明确要求。

---

### Task 1: 新增 3 项 TDD 测试（先红）

**Files:**
- Modify: `tests/seo.test.mjs`（文件末尾追加 2 个 test）
- Modify: `tests/css.test.mjs`（文件末尾追加 1 个 test）

**Interfaces:**
- Consumes: 现测试文件结构（`html`/`css` 已在模块顶层读取完毕，直接复用）。
- Produces: 3 个新测试（v2 的实现必须让其转绿）。

- [ ] **Step 1: 在 `tests/seo.test.mjs` 末尾追加**

```js
test("about stats block: stats-grid and data-count present", () => {
  assert.ok(html.includes('class="stats-grid"'), "missing stats-grid");
  assert.match(html, /data-count="\d+"/, "stats should carry numeric data-count");
});

test("skills restructured into numbered rows", () => {
  assert.ok(html.includes('class="skill-rows"'), "missing skill-rows container");
  assert.ok(html.includes('class="skill-row"'), "missing skill-row items");
});
```

- [ ] **Step 2: 在 `tests/css.test.mjs` 末尾追加**

```js
test("marquee component present", () => {
  assert.match(css, /\.marquee/);
  assert.match(css, /@keyframes\s+marquee/);
});
```

- [ ] **Step 3: 运行测试确认新增项失败、旧项仍绿**

Run: `npm test`
Expected: `tests 24 | pass 21 | fail 3`（3 个新增失败：HTML 无 stats-grid/skill-rows，CSS 无 marquee；旧断言全部仍 pass）。

- [ ] **Step 4: 提交**

```bash
git add tests/seo.test.mjs tests/css.test.mjs
git commit -m "test: add TDD assertions for v2 dark redesign (marquee, stats, skill rows)"
```

---

### Task 2: index.html 结构调整（导航 / Hero / 跑马灯 / 关于我 / 技能 / 联系 / theme-color）

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: 现有 218 行 index.html（唯一 `h1`、`#folderGrid`、`#workModal`、五个 h2 必须原样保留位置与文本）。
- Produces: v2 结构供 Task 3 (CSS) 与 Task 4 (JS) 使用——类名清单：`nav-num`、`marquee`/`marquee-track`（两条）、`stats-grid`/`.stat-num[data-count]`/`.stat-suffix`、`skill-rows`/`skill-row`/`skill-row-btn`/`skill-num`/`skill-name`/`skill-panel`/`skill-toggle`、`cta-gold`。

- [ ] **Step 1: 更新 theme-color（第 10 行附近）**

将 `<meta name="theme-color" content="#0f1115">` 改为 `<meta name="theme-color" content="#100f0d">`。

- [ ] **Step 2: 更新字体链接（第 25 行）**

将 `Inter:wght@400;500;600;700` 改为 `Inter:wght@400;500;600;700;800`（同一文件族，无新下载文件，`display=swap` 保留）。

- [ ] **Step 3: 桌面导航改为数字编号（第 66-72 行）**

将 `.nav-links` 整个替换为：

```html
    <div class="nav-links">
      <a href="#hero"><span class="nav-num">01</span>首页</a>
      <a href="#about"><span class="nav-num">02</span>关于我</a>
      <a href="#portfolio"><span class="nav-num">03</span>作品集</a>
      <a href="#skills"><span class="nav-num">04</span>设计能力</a>
      <a href="#life"><span class="nav-num">05</span>生活</a>
      <a href="#contact"><span class="nav-num">06</span>联系</a>
    </div>
```

`.nav-contact`（第 73 行）改为 `class="button button-gold nav-contact"`；`.menu-toggle`、`.mobile-menu`（第 74-77 行）保持不动。

- [ ] **Step 4: Hero 超大排版（第 84-97 行 `hero-inner` 内）**

保留 `hero-outline`（"WU HONGLIANG"）、`hero-tag`、`h1#hero-title`（文本逐字不动，样式交给 CSS）、`hero-subtitle`、`hero-actions`、`figure.hero-visual`。仅将 `hero-actions` 里的第一颗按钮从 `button-dark` 改为 `button-gold`（其余不动）：

```html
      <div class="hero-actions reveal">
        <a class="button button-gold" href="#portfolio">查看作品集</a>
        <a class="button button-light" href="#contact">联系合作</a>
      </div>
```

- [ ] **Step 5: 跑马灯 #1 —— 插入到 `</section>`（hero 结束，第 98 行）之后、`<section class="section about-section"`（第 100 行）之前**

```html
<div class="marquee" aria-hidden="true">
  <div class="marquee-track">
    <span>UI/UX 设计师 · AIGC 设计师 · AI 网站设计 · 品牌视觉 · 数字人 · Blender ·</span>
    <span>UI/UX 设计师 · AIGC 设计师 · AI 网站设计 · 品牌视觉 · 数字人 · Blender ·</span>
  </div>
</div>
```

- [ ] **Step 6: 关于我 stats → stats-grid（第 109-114 行）**

将整个 `.stats.reveal` 块替换为：

```html
      <div class="reveal">
        <div class="stats-grid">
          <div class="stat"><b class="stat-num" data-count="14">14</b><span class="stat-suffix">+</span><span>年设计经验</span></div>
          <div class="stat"><b class="stat-num" data-count="3">3</b><span>家头部企业服务</span></div>
          <div class="stat"><b class="stat-num stat-alpha">千万</b><span>级用户产品</span></div>
          <div class="stat"><b class="stat-num stat-alpha">AIGC</b><span>深度实践者</span></div>
        </div>
      </div>
```

（`about-lead`、`about-note`、`mark`、`strong` 内的文本逐字保留。）

- [ ] **Step 7: 跑马灯 #2 —— 插入到 portfolio 的 `</div></section>`（第 130 行）之后、`<div class="modal"`（第 132 行）之前**

```html
<div class="marquee marquee-reverse" aria-hidden="true">
  <div class="marquee-track">
    <span>SELECTED WORKS · BRAND · UX · AIGC · WEB · 2014 → 2026 ·</span>
    <span>SELECTED WORKS · BRAND · UX · AIGC · WEB · 2014 → 2026 ·</span>
  </div>
</div>
```

- [ ] **Step 8: 设计能力改编号行（第 159-163 行）**

将 `.skills-groups.reveal` 整块替换为：

```html
    <div class="reveal">
      <div class="skill-rows">
        <div class="skill-row">
          <button class="skill-row-btn" type="button" aria-expanded="false" aria-controls="skill-panel-1">
            <span class="skill-num">01</span><span class="skill-name">UI/UX 设计</span><span class="skill-tags-inline">产品体验 · Web · APP</span><span class="skill-toggle">Open</span>
          </button>
          <div class="skill-panel" id="skill-panel-1" hidden>
            <ul class="skill-tags"><li>UI/UX 设计</li><li>Web 设计</li><li>APP 设计</li><li>B 端产品</li></ul>
            <p>从用户研究到交互与视觉落地，打磨移动端与 Web 产品体验。</p>
          </div>
        </div>
        <div class="skill-row">
          <button class="skill-row-btn" type="button" aria-expanded="false" aria-controls="skill-panel-2">
            <span class="skill-num">02</span><span class="skill-name">AIGC 创意</span><span class="skill-tags-inline">AI 图片生成 · 数字人</span><span class="skill-toggle">Open</span>
          </button>
          <div class="skill-panel" id="skill-panel-2" hidden>
            <ul class="skill-tags"><li>AIGC 设计</li><li>AI 图片生成</li><li>数字人设计</li></ul>
            <p>用生成式 AI 加速创意产出与角色定制，探索设计师的新工作流。</p>
          </div>
        </div>
        <div class="skill-row">
          <button class="skill-row-btn" type="button" aria-expanded="false" aria-controls="skill-panel-3">
            <span class="skill-num">03</span><span class="skill-name">品牌与 Logo</span><span class="skill-tags-inline">品牌视觉 · 标志系统</span><span class="skill-toggle">Open</span>
          </button>
          <div class="skill-panel" id="skill-panel-3" hidden>
            <ul class="skill-tags"><li>品牌设计</li><li>视觉设计</li><li>Logo 设计</li></ul>
            <p>从命名到标志系统，为多行业品牌构建统一视觉资产。</p>
          </div>
        </div>
        <div class="skill-row">
          <button class="skill-row-btn" type="button" aria-expanded="false" aria-controls="skill-panel-4">
            <span class="skill-num">04</span><span class="skill-name">B 端产品</span><span class="skill-tags-inline">软件产品 · 企业服务</span><span class="skill-toggle">Open</span>
          </button>
          <div class="skill-panel" id="skill-panel-4" hidden>
            <ul class="skill-tags"><li>B 端产品</li><li>软件产品</li><li>团队交付</li></ul>
            <p>复杂 B 端系统体验设计，主导核心方案与多角色协同交付。</p>
          </div>
        </div>
      </div>
    </div>
```

（`.portfolio-section`、`#folderGrid`、`#workModal`、modal 内部全部、life-section、contact-section 内容的 id/文本均不动。`figure`、`article` 仍在 Hero 与 life-card 中，seo 语义测试不受影响。）

- [ ] **Step 9: 联系 CTA 改为金色大号（第 201-203 行）**

```html
    <div class="contact-cta reveal">
      <a class="button cta-gold" href="mailto:wuhongliang55@163.com">Let's Talk → 预约设计合作</a>
    </div>
```

- [ ] **Step 10: 运行测试**

Run: `npm test`
Expected: `tests 24 | pass 23 | fail 1`——seo/css 两个新增 HTML 测试（stats-grid、skill-rows）转绿，marquee 测试仍红（等 Task 3）；原有 21 项全部保持 pass。

- [ ] **Step 11: 提交**

```bash
git add index.html
git commit -m "feat(html): restructure nav/hero/about/skills/contact for v2 dark design"
```

---

### Task 3: style.css 深色皮肤 + marquee/stats-grid/skill-rows/cta（全套重写）

**Files:**
- Modify: `style.css`（整体重写，单文件交付）

**Interfaces:**
- Consumes: Task 2 产出的 HTML 类名。
- Produces: 满足全部 css 测试的 v2 样式表；供浏览器直接渲染。

- [ ] **Step 1: 用以下完整内容重写 `style.css`**

（这是 Task 3 的完整交付物。必须逐字保证测试要求的 8 个 token 名、两个断点、6 个 folder 类名、`prefers-reduced-motion`、grid/flex、`aspect-ratio` 全部存在；同时保留 v1 的 folder-scene 动效结构与弹窗结构，仅换肤。）

```css
:root {
  --bg: #100f0d;
  --surface: #1a1917;
  --surface-soft: #24221f;
  --ink: #f0e9dd;
  --muted: #9a9183;
  --accent: #e3b25e;
  --accent-soft: rgba(227, 178, 94, .12);
  --border: #2a2825;
  --selection: rgba(227, 178, 94, .28);
  --folder-back: #26231f;
  --folder-front: #322e28;
  --container: 1180px;
  --ease: cubic-bezier(.16, 1, .3, 1);
  --radius: 16px;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; scroll-padding-top: 78px; }
body { font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif; color: var(--ink); background: var(--bg); line-height: 1.7; -webkit-font-smoothing: antialiased; }
::selection { background: var(--selection); }
img { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }
button { font: inherit; color: inherit; background: none; border: 0; cursor: pointer; }
:focus-visible { outline: 3px solid rgba(227, 178, 94, .45); outline-offset: 3px; }
.container { width: min(var(--container), 100% - 48px); margin-inline: auto; }
.en { font-family: "Inter", "Helvetica Neue", Arial, sans-serif; }

.section { padding: clamp(96px, 12vw, 160px) 0; }
.section-heading { max-width: 720px; }
.section-heading h2 { font-size: clamp(2rem, 4vw, 3.4rem); font-weight: 700; letter-spacing: -.03em; line-height: 1.08; margin-bottom: 14px; }
.section-heading > p:last-child { color: var(--muted); font-size: 15px; max-width: 58ch; }
.eyebrow { color: var(--accent); font-size: 11px; font-weight: 600; letter-spacing: .18em; }
.outline-text { position: absolute; top: 8px; left: 0; right: 0; z-index: 0; font-family: "Inter", sans-serif; font-weight: 800; font-size: clamp(64px, 12vw, 150px); letter-spacing: .02em; color: transparent; -webkit-text-stroke: 1px rgba(240, 233, 221, .06); white-space: nowrap; pointer-events: none; user-select: none; }
.section-heading, .skill-rows, .life-grid, .contact-heading, .contact-grid, .contact-cta { position: relative; z-index: 1; }

.button { display: inline-flex; min-height: 46px; align-items: center; justify-content: center; gap: 10px; padding: 11px 22px; border-radius: 999px; font-size: 14px; font-weight: 500; transition: transform .3s var(--ease), background .3s, color .3s, box-shadow .3s; }
.button:hover { transform: translateY(-2px); }
.button-gold { color: #100f0d; background: var(--accent); }
.button-gold:hover { box-shadow: 0 12px 28px rgba(227, 178, 94, .28); }
.button-light { color: var(--ink); background: rgba(240, 233, 221, .06); border: 1px solid rgba(240, 233, 221, .18); }
.button-light:hover { background: rgba(240, 233, 221, .12); border-color: rgba(240, 233, 221, .3); }
.cta-gold { min-height: 60px; padding: 16px 34px; font-size: 17px; font-weight: 700; color: #100f0d; background: var(--accent); border-radius: 999px; }
.cta-gold:hover { box-shadow: 0 16px 40px rgba(227, 178, 94, .34); }
.reveal { opacity: 0; transform: translateY(24px); transition: opacity .7s ease, transform .7s var(--ease); }
.reveal.is-visible { opacity: 1; transform: none; }
mark { background: linear-gradient(transparent 62%, rgba(227, 178, 94, .32) 62%); padding: 0 .1em; color: inherit; }

.site-header { position: fixed; inset: 0 0 auto; z-index: 40; height: 64px; transition: background .3s, box-shadow .3s; }
.site-header.is-scrolled { background: rgba(16, 15, 13, .82); box-shadow: 0 1px 0 var(--border); backdrop-filter: blur(16px); }
.nav-shell { position: relative; display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 24px; width: min(var(--container), 100% - 48px); height: 64px; margin-inline: auto; }
.brand { display: inline-flex; align-items: center; gap: 10px; font-weight: 700; font-size: 16px; }
.brand-mark { display: grid; width: 34px; height: 34px; place-items: center; color: #100f0d; background: var(--accent); border-radius: 10px; font-weight: 800; }
.brand-en { display: block; font-size: 10px; letter-spacing: .18em; color: var(--muted); font-weight: 500; }
.nav-links { display: flex; align-items: center; gap: 26px; color: var(--muted); font-size: 14px; }
.nav-links a { display: inline-flex; align-items: baseline; gap: 5px; transition: color .25s; }
.nav-links .nav-num { font-family: "Inter", sans-serif; font-size: 10px; color: var(--accent); }
.nav-links a:hover { color: var(--ink); }
.nav-contact { justify-self: end; }
.menu-toggle, .mobile-menu { display: none; }

.hero { position: relative; min-height: 92svh; display: flex; align-items: center; overflow: hidden; padding: 130px 0 60px; }
.hero-outline { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-family: "Inter", sans-serif; font-weight: 800; font-size: clamp(90px, 18vw, 240px); letter-spacing: .02em; color: transparent; -webkit-text-stroke: 1px rgba(240, 233, 221, .07); white-space: nowrap; user-select: none; pointer-events: none; z-index: 0; }
.hero-inner { position: relative; z-index: 1; width: min(1180px, 100% - 48px); margin-inline: auto; display: grid; grid-template-columns: 1.4fr .6fr; gap: 60px; align-items: center; }
.hero-tag { display: inline-flex; align-items: center; gap: 9px; padding: 6px 12px; color: var(--accent); background: rgba(227, 178, 94, .1); border: 1px solid rgba(227, 178, 94, .22); border-radius: 999px; font-size: 12px; }
.pulse-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); animation: pulse 2.2s infinite; }
@keyframes pulse { 50% { opacity: .4; transform: scale(.7); } }
.hero-title { margin-top: 22px; font-size: clamp(30px, 4.2vw, 52px); font-weight: 700; letter-spacing: -.04em; line-height: 1.12; }
.hero-name { display: block; font-size: clamp(52px, 8.5vw, 96px); font-weight: 800; letter-spacing: -.02em; margin: 8px 0; }
.hero-role { display: block; color: var(--accent); font-size: clamp(20px, 2.4vw, 30px); font-weight: 600; }
.hero-subtitle { margin-top: 20px; color: var(--muted); font-size: 16px; max-width: 46ch; }
.hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 34px; }
.hero-visual { position: relative; margin: 0; }
.hero-visual img { width: 100%; max-width: 360px; aspect-ratio: 360 / 460; object-fit: cover; border-radius: var(--radius); border: 1px solid rgba(227, 178, 94, .35); box-shadow: 0 30px 60px -30px rgba(0, 0, 0, .6); }

.marquee { position: relative; display: flex; overflow: hidden; padding: 22px 0; border-block: 1px solid var(--border); background: var(--surface); }
.marquee-track { display: flex; flex-wrap: nowrap; gap: 0; white-space: nowrap; animation: marquee 28s linear infinite; }
.marquee-track span { padding-right: .4em; font-family: "Inter", "PingFang SC", sans-serif; font-size: 15px; letter-spacing: .14em; color: var(--muted); }
.marquee-track span::first-letter { color: var(--accent); }
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.marquee-reverse .marquee-track { animation-direction: reverse; }

.about-grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: clamp(32px, 5vw, 72px); align-items: center; margin-top: 40px; }
.about-lead { font-size: clamp(18px, 2.2vw, 26px); line-height: 1.8; font-weight: 500; }
.about-note { margin-top: 20px; color: var(--muted); font-size: 15px; max-width: 60ch; }
.stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
.stat { background: var(--surface); padding: 26px 22px; display: grid; grid-template-columns: auto auto 1fr; gap: 6px; align-items: baseline; }
.stat-num { font-family: "Inter", "PingFang SC", sans-serif; font-size: clamp(28px, 3.4vw, 40px); font-weight: 800; letter-spacing: -.02em; color: var(--accent); }
.stat-suffix { color: var(--accent); font-weight: 800; font-size: clamp(20px, 3vw, 30px); }
.stat-alpha { font-family: "PingFang SC", sans-serif; font-size: clamp(22px, 3vw, 34px); }
.stat > span:last-child { grid-column: 1 / -1; color: var(--muted); font-size: 13px; }

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
.folder-back { z-index: 2; height: 178px; background: var(--folder-back); border: 1px solid rgba(240, 233, 221, .08); box-shadow: 0 18px 34px rgba(0, 0, 0, .45); transition: transform .58s var(--ease); }
.folder-back::before { content: ""; position: absolute; left: 0; top: -32px; width: 42%; height: 54px; background: inherit; border-radius: 14px 20px 0 0; }
.folder-front { z-index: 8; height: 152px; padding: 48px 22px 18px; color: var(--ink); background: linear-gradient(155deg, var(--folder-front), #26231f); border: 1px solid rgba(240, 233, 221, .1); box-shadow: inset 0 1px 0 rgba(240, 233, 221, .06), 0 18px 34px rgba(0, 0, 0, .45); transform-origin: center bottom; transition: transform .58s var(--ease); }
.folder-front b { position: absolute; right: 20px; top: 18px; font-family: "Inter", sans-serif; font-size: 10px; color: var(--accent); letter-spacing: .08em; }
.folder-front strong, .folder-front small { display: block; }
.folder-front strong { font-size: 22px; font-weight: 700; letter-spacing: -.02em; }
.folder-front small { margin-top: 3px; color: var(--muted); font-size: 11px; }
.folder-photo { position: absolute; z-index: 5; left: 50%; bottom: 110px; width: 56%; padding: 6px; overflow: hidden; background: var(--surface); border: 1px solid rgba(240, 233, 221, .12); border-radius: 10px; box-shadow: 0 16px 28px rgba(0, 0, 0, .5); transform: translate(-50%, 56px) rotate(0) scale(.82); transform-origin: center bottom; transition: transform .68s var(--ease); }
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
@keyframes folder-float { 50% { transform: translateY(-7px); } }
@media (prefers-reduced-motion: no-preference) {
  .folder-card:not(:hover):not([aria-expanded="true"]) .folder-scene { animation: folder-float 5s ease-in-out infinite; }
  .folder-card:nth-child(2n) .folder-scene { animation-delay: -1.7s; }
  .folder-card:nth-child(3n) .folder-scene { animation-delay: -3.1s; }
}
.folder-loading { grid-column: 1 / -1; color: var(--muted); font-size: 14px; text-align: center; padding: 60px 0; }

.modal { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; }
.modal[hidden] { display: none; }
.modal-backdrop { position: absolute; inset: 0; background: rgba(0, 0, 0, .78); backdrop-filter: blur(6px); }
.modal-card { position: relative; z-index: 1; width: min(920px, calc(100vw - 40px)); max-height: 88svh; overflow: auto; background: var(--surface); border: 1px solid var(--border); border-radius: 20px; box-shadow: 0 40px 90px rgba(0, 0, 0, .6); padding: 34px; }
.modal-close { position: absolute; top: 16px; right: 16px; width: 40px; height: 40px; border-radius: 50%; font-size: 22px; color: var(--muted); background: var(--surface-soft); }
.modal-close:hover { color: var(--accent); }
.modal-head h2 { font-size: 26px; letter-spacing: -.03em; margin: 8px 0 6px; }
.modal-desc { color: var(--muted); font-size: 14px; max-width: 60ch; }
.modal-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
.modal-meta span { font-size: 11px; color: var(--accent); background: var(--accent-soft); border: 1px solid rgba(227, 178, 94, .22); padding: 5px 9px; border-radius: 7px; }
.modal-viewer { position: relative; margin-top: 22px; }
.modal-figure img { width: 100%; max-height: 58svh; object-fit: contain; border-radius: 12px; background: var(--bg); }
.modal-figure figcaption { text-align: center; color: var(--muted); font-size: 12px; margin-top: 10px; font-family: "Inter", sans-serif; }
.modal-arrow { position: absolute; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 50%; color: var(--ink); background: var(--surface-soft); border: 1px solid var(--border); box-shadow: 0 10px 24px rgba(0, 0, 0, .5); font-size: 18px; }
.modal-arrow:hover { color: var(--accent); }
.modal-prev { left: -14px; } .modal-next { right: -14px; }
@media (max-width: 700px) { .modal-card { padding: 24px 16px; } .modal-prev { left: 4px; } .modal-next { right: 4px; } }

.skills-section { position: relative; }
.skills-section .outline-text { text-align: center; }
.skill-rows { display: grid; gap: 12px; margin-top: 40px; }
.skill-row { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; transition: border-color .3s, box-shadow .3s; }
.skill-row.open { border-color: rgba(227, 178, 94, .4); box-shadow: 0 18px 40px -24px rgba(0, 0, 0, .6); }
.skill-row-btn { display: grid; grid-template-columns: auto 1fr auto auto; gap: 18px; align-items: center; width: 100%; padding: 24px 26px; text-align: left; }
.skill-num { font-family: "Inter", sans-serif; font-size: 14px; font-weight: 800; color: var(--accent); }
.skill-name { font-size: clamp(17px, 2vw, 22px); font-weight: 700; }
.skill-tags-inline { color: var(--muted); font-size: 13px; }
.skill-toggle { font-family: "Inter", sans-serif; font-size: 12px; letter-spacing: .12em; color: var(--accent); }
.skill-panel { padding: 0 26px 24px; }
.skill-panel ul { list-style: none; }
.skill-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.skill-tags li { padding: 7px 12px; font-size: 13px; color: var(--accent); background: var(--accent-soft); border: 1px solid rgba(227, 178, 94, .22); border-radius: 999px; }
.skill-panel p { margin-top: 14px; color: var(--muted); font-size: 14px; max-width: 60ch; }

.life-section .life-grid { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 40px; }
.life-card { flex: 1 1 180px; padding: 30px 24px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); transition: transform .4s var(--ease), box-shadow .4s, border-color .3s; }
.life-card:hover { transform: translateY(-5px); border-color: rgba(227, 178, 94, .4); box-shadow: 0 22px 44px -22px rgba(0, 0, 0, .6); }
.life-emoji { font-size: 28px; }
.life-card h3 { margin: 14px 0 6px; font-size: 18px; font-weight: 600; }
.life-card p { color: var(--muted); font-size: 13px; }

.contact-section { background: var(--surface); border-block: 1px solid var(--border); }
.contact-section .section-heading > p:last-child, .contact-section .eyebrow { color: var(--accent); }
.contact-section h2 { color: var(--ink); }
.contact-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; margin-top: 40px; }
.contact-cell { display: grid; gap: 4px; padding: 26px 22px; background: var(--surface); color: var(--ink); text-align: left; transition: background .3s; }
.contact-cell:hover { background: var(--surface-soft); }
.contact-cell small { color: var(--muted); font-size: 11px; letter-spacing: .1em; }
.contact-cell strong { font-size: 18px; font-weight: 600; }
.copy-tip { color: var(--accent); font-size: 12px; opacity: 0; transition: opacity .3s; }
.copied .copy-tip { opacity: 1; }
.contact-cta { margin-top: 34px; }

.site-footer { background: var(--bg); color: var(--muted); border-top: 1px solid var(--border); }
.footer-inner { display: flex; justify-content: space-between; gap: 16px; align-items: center; padding: 28px 0; font-size: 12px; }
.footer-inner a { color: var(--ink); }

.toast { position: fixed; left: 50%; bottom: 26px; z-index: 200; padding: 11px 18px; color: var(--bg); background: var(--accent); border-radius: 10px; font-size: 13px; font-weight: 600; opacity: 0; transform: translate(-50%, 12px); pointer-events: none; transition: opacity .3s, transform .3s var(--ease); }
.toast.is-visible { opacity: 1; transform: translate(-50%, 0); }

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
  .menu-toggle { display: grid; width: 40px; height: 40px; place-content: center; gap: 5px; border: 1px solid var(--border); border-radius: 10px; background: rgba(240, 233, 221, .06); }
  .menu-toggle span { display: block; width: 17px; height: 1.5px; background: var(--ink); }
  .mobile-menu { position: absolute; top: 60px; right: 0; display: grid; gap: 2px; width: 180px; padding: 10px; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; box-shadow: 0 18px 40px rgba(0, 0, 0, .5); }
  .mobile-menu[hidden] { display: none; }
  .mobile-menu a { padding: 10px 12px; border-radius: 8px; font-size: 14px; }
  .hero { min-height: 100svh; align-items: flex-start; padding: 130px 0 40px; }
  .hero-title { font-size: 26px; }
  .hero-name { font-size: 48px; }
  .hero-role { font-size: 20px; }
  .hero-actions .button { padding-inline: 16px; min-height: 44px; font-size: 13px; }
  .folder-grid { grid-template-columns: 1fr; }
  .folder-card:nth-child(n), .folder-card:nth-child(2n) { transform: none; }
  .folder-scene { height: 360px; }
  .marquee-track span { font-size: 13px; }
  .skill-row-btn { grid-template-columns: auto 1fr auto; gap: 12px; padding: 20px 18px; }
  .skill-tags-inline { display: none; }
  .footer-inner { flex-direction: column; align-items: flex-start; gap: 8px; }
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
  .marquee-track { animation: none; }
  .reveal { opacity: 1; transform: none; }
  .folder-scene { animation: none !important; }
}
```

> 注意：以上为最终交付物，逐字替换 `style.css` 即可。字体/颜色已是终值。

- [ ] **Step 2: 运行测试**

Run: `npm test`
Expected: `tests 24 | pass 24 | fail 0`——marquee 测试转绿；8 个 token、断点、folder 类名、reduced-motion、grid/flex、aspect-ratio 全部断言通过。

- [ ] **Step 3: 语法自检**

Run: `node -e "const c=require('fs').readFileSync('style.css','utf8'); let o=(c.match(/{/g)||[]).length, cl=(c.match(/}/g)||[]).length; console.log('braces', o, cl, o===cl?'OK':'MISMATCH')"`
Expected: `braces <N> <N> OK`

- [ ] **Step 4: 提交**

```bash
git add style.css
git commit -m "feat(css): v2 dark-studio skin with marquee, stats-grid, skill rows, gold CTA"
```

---

### Task 4: script.js 追加统计计数与技能行展开

**Files:**
- Modify: `script.js`（仅在现有 IIFE 末尾、`fetch` 块之前插入两段新逻辑；现有代码逐行保留）

**Interfaces:**
- Consumes: Task 2 的 HTML——`.stat-num[data-count]`、`.stat-num.stat-alpha`、`.skill-row`/`.skill-row-btn`/`.skill-panel`/`.skill-toggle`/`.skill-rows`；现有 `reduceMotion` 常量、`io`（IntersectionObserver）与 `document.querySelectorAll(".reveal")` 保持原样。
- Produces: 计数终值文本与技能行 `.open`/`aria-expanded`/`hidden` 切换；供后续审查者人工验证。

- [ ] **Step 1: 在 `addEventListener("keydown", ...)` 结束之后、`// ---- 数据加载 ----` 注释之前插入**

```js
  // ---- 关于我：大数字滚动计数 ----
  const counterIo = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      counterIo.unobserve(el);
      const raw = el.dataset.count;
      if (!raw) return;
      const end = parseInt(raw, 10);
      if (reduceMotion) { el.textContent = String(end); return; }
      const dur = 900;
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        el.textContent = String(Math.round(end * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll(".stat-num[data-count]").forEach((el) => counterIo.observe(el));

  // ---- 设计能力：编号行 Open/Close 展开 ----
  document.querySelectorAll(".skill-row").forEach((row) => {
    const btn = row.querySelector(".skill-row-btn");
    const panel = row.querySelector(".skill-panel");
    const toggle = row.querySelector(".skill-toggle");
    if (!btn || !panel || !toggle) return;
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      panel.hidden = open;
      row.classList.toggle("open", !open);
      toggle.textContent = open ? "Open" : "Close";
    });
  });
```

- [ ] **Step 2: 验证既有断言仍绿**

Run: `npm test`
Expected: `tests 24 | pass 24 | fail 0`（seo 测试检查 `loading="lazy"` 与 `fetch("portfolio.json")` 仍在 script.js——因为现有代码逐字保留）。

Run: `node --check script.js`
Expected: 无输出（语法通过）。

- [ ] **Step 3: 提交**

```bash
git add script.js
git commit -m "feat(js): add stats count-up and numbered skill-row toggle"
```

---

### Task 5: 最终验证（真实浏览器 + 测试全绿 + 审计更新）

**Files:**
- Modify: `docs/superpowers/plans/2026-09-17-portfolio-site-audit.md`（在顶部引用 v2 规格，并在「真实浏览器验证」后追加一段 v2 结果）

**Interfaces:**
- Consumes: Task 2-4 的产物；现有审计文档。
- Produces: 可交付的验证证据。

- [ ] **Step 1: 全量测试**

Run: `npm test`
Expected: `tests 24 | pass 24 | fail 0`

- [ ] **Step 2: 真实浏览器验证（headless Chrome CDP）**

在项目根运行静态服务：`(python3 -m http.server 8123 >/tmp/serve.log 2>&1 &)`。

用 CDP（可仿照历史使用的 `/tmp/resp.mjs` 思路，也可用 playwright/puppeteer 若已安装；**不引入新依赖**）对 `http://127.0.0.1:8123/index.html` 在 375/390/430/1280/1440/1920 六个宽度断言以下项并记录为表：
- `document.documentElement.scrollWidth - document.documentElement.clientWidth === 0`（无横向溢出，body 同）
- `.marquee` 存在（2 条）、`getComputedStyle` 的 `animation-name` 含 `marquee`
- `.stat-num` 数量与 `data-count` 存在
- `.skill-row` 数量 4、点击 `#skills .skill-row-btn`（第 1 行）后 `aria-expanded="true"` 且 `.skill-panel` 不再 `hidden`
- `.folder-card` 数量 8、`iframe` 无用——弹窗元素 `#workModal` 存在

Expected: 全部通过；横向溢出为 0 全部宽度。

- [ ] **Step 3: 审计文档更新**

在 `docs/superpowers/plans/2026-09-17-portfolio-site-audit.md` 顶部块引用后追加：

```markdown
## v2（Mark91 深色工作室风）验证记录

> 规格：`docs/superpowers/specs/2026-09-17-portfolio-site-design-v2-mark91.md`（2026-09-17 确认）

- 测试：24/24 全绿（原 21 + marquee、stats-grid+data-count、skill-rows 新增 3 项）
- 结构保留：唯一个 h1、五 section h2、folderGrid/workModal、JSON-LD、header→main→footer 顺序、72 WebP、portfolio.json 数据
- 真实浏览器（headless Chrome CDP）6 宽度：横向溢出 0；2 条跑马灯动画存在；4 行技能行点击展开 aria-expanded 翻转；8 个文件夹卡片正常渲染
- 待部署确认项（沿袭 v1）：canonical/og:url 占位域名、og:image 相对 SVG → 部署前换真实域名与栅格图
```

- [ ] **Step 4: 提交**

```bash
git add docs/superpowers/plans/2026-09-17-portfolio-site-audit.md
git commit -m "docs: record verified v2 dark redesign in final audit"
```

- [ ] **Step 5: 全量回归（最后确认）**

Run: `npm test` 再跑一次
Expected: `tests 24 | pass 24 | fail 0`；`git status --short` 无未提交改动。

---

## Self-Review Notes（计划作者自查，非执行步骤）

- 规格覆盖：序号导航(§5.1→T2.3)、Hero 超大排版(§5.2→T2.4+T3)、跑马灯×2(§5.4→T2.5/T2.7+T3)、stats-grid(§5.3→T2.6+T4)、skill-rows(§5.5→T2.8+T4)、金色 CTA(§5.6→T2.9+T3)、folder 深色皮肤(§5.7→T3)、theme-color(footer→T2.1)、新增 3 测试(§7→T1)。全规格有对应任务。
- 占位符：无 TBD/TODO；每个代码步骤给出逐字内容。
- 类型一致性：`stat-num`/`data-count`/`stat-suffix`/`skill-row-btn`/`skill-panel`/`skill-toggle`/`marquee-track`/`cta-gold` 在三个任务间一致；`reduceMotion`、`io` 复用的是 script.js 现有名字（T4 不新增同名变量）。
- 已知修正（Task 2 执行中发现）：T1 新增 seo 测试逐字断言 `class="stats-grid"`/`class="skill-rows"`（含闭合引号），故容器本体只能带这一个类；`reveal` 动效类移到一个外层包裹 `<div class="reveal">`。Task 3 CSS 的 `.stats-grid`/`.skill-rows` 选择器不受包裹影响。
- 已知修正（final review）：stat 静态文本改为终值（14/3）以满足 spec §5.3「无 JS 可见终值」；JS 计数动画首帧仍从 0 起算。