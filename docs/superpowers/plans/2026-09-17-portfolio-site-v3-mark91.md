# 武红亮作品集 v3 — Mark91 版式语言吸收 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 v2 深色作品集按真实 Mark91 站点的版式语言重构视觉层（`#` 大标题、文件夹图标导航、Let's Talk、统计大字段、`.svg-frame` 金色旋转装饰），内容与数据契约保持不变，24 项测试全绿。

**Architecture:** 纯纯视觉层手术：保持 index.html 的区块与 id 契约、script.js 完全不动、portfolio.json / assets 不动；只改 index.html 若干容器的 class/结构、style.css 的样式与新增 `.svg-frame` 模块、tests 增加 v3 断言。CSS 令牌与断点 767/1023 不变。

**Tech Stack:** 原生 HTML/CSS/JS（无框架无依赖）、Node `node --test`、headless Chrome CDP。

**Spec:** `docs/superpowers/specs/2026-09-17-portfolio-site-design-v3-mark91.md`

## Global Constraints

- `/Users/wuhongliang/Documents/Default Project/wuhongliang-portfolio` 为工作根目录，分支策略沿用 v2（在 main 上直接提交 commits 前缀 feat/docs/test）。
- **不新增依赖**：不引入任何 package；测试仅在 `tests/*.test.mjs` 用 `node:test` 与 `node:assert/strict`。
- 不允许改 `script.js`（TDD 断言加在 HTML/CSS 侧）、`portfolio.json`、`assets/works/**`、`robots.txt`、`sitemap.xml`、`favicon.svg`、`assets/avatar.svg`。
- 24 现有测试 + Task 1 新增 3 项 ＝ 27 项，全绿：`npm test` 输出 `tests 27 | pass 27 | fail 0`。
- 保留契约（逐字）：六个 h2 文本 `关于我`/`我的作品集`/`设计能力`/`我的生活与爱好`/`联系方式`，id `folderGrid`、`workModal`、`site-header`、`menuToggle`、`mobileMenu`、`copyWechat`、`toast`；`class="stats-grid"`、`class="skill-rows"`、`class="skill-row"`、`class="skill-row-btn"`；单 h1 含 武红亮 与 AIGC；`class="marquee"` 与 `@keyframes marquee`；CSS 令牌 `--bg --ink --muted --accent --border --surface --accent-soft`；断点 `@media (max-width: 767px)` 与 `(max-width: 1023px)` 原样保留；`prefers-reduced-motion: reduce` 保留。
- 统计真实值：`14+` 年设计经验 / `3` 家头部企业服务 / `千万`级用户产品 / `AIGC` 深度实践者（现状值，不引入 98%/13 等团队向数字）。
- 邮箱：`wuhongliang55@163.com`（已存在于 index.html 35/248-249/254 行与 script.js）。
- 提交信息规范：`feat(html): …` / `feat(css): …` / `test: …` / `docs(plan): …`。
- 每个 CSS 新增块必须**唯一命名 class**，不得与现有规则冲突（检查方式：`rg -c "<class>" style.css` 计数＝1 条定义块）。

---

### Task 1: v3 TDD 断言（先红）

**Files:**
- Modify: `tests/seo.test.mjs`（追加）
- Modify: `tests/css.test.mjs`（追加）

**Interfaces:**
- Produces: 断言 v3 关键结构存在，供 Task 2/3 驱动实现：
  - HTML: `class="svg-frame"`、`id="center1"`、`data-count="14"` 且标签文本含 `14`（静态终值）、`Let's Talk`、`class="nav-icon"`（导航文件夹小图标）、`Back To Top` 文本。
  - CSS: `.svg-frame` 规则、`@keyframes rotate16`、`.svg-frame:hover svg` 存在。
- Consumes: 现有 24 项测试须仍全绿。

- [ ] **Step 1: 追加 HTML 断言到 `tests/seo.test.mjs`（文件末尾）**

```js
test("v3 hero visual is svg-frame with gold center", () => {
  assert.ok(html.includes('class="svg-frame"'), "missing svg-frame");
  assert.match(html, /<svg[\s\S]*?id="center1"/, "svg-frame needs #center1 child");
});

test("v3 stats keep static final values and nav icons exist", () => {
  assert.match(html, /data-count="14"\s*>14</, "stat 14 must render static 14");
  assert.ok(html.includes('class="nav-icon"'), "missing folder nav icon class");
  assert.match(html, /Let's Talk/, "Let's Talk CTA present");
  assert.match(html, /Back To Top/, "footer Back To Top present");
});
```

- [ ] **Step 2: 追加 CSS 断言到 `tests/css.test.mjs`（文件末尾）**

```js
test("v3 svg-frame animation module defined", () => {
  assert.match(css, /\.svg-frame/);
  assert.match(css, /\.svg-frame:hover\s+svg/);
  assert.match(css, /@keyframes\s+rotate16/);
  assert.match(css, /#center1\s*\{/);
});
```

- [ ] **Step 3: 运行测试确认新断言失败（红）**

Run: `npm test`
Expected: `tests 27 | pass 24 | fail 3`（3 个新 test 各含多个断言，任一不满足即该 test fail；实测以输出为准，`pass` 应为 24 → 变少）

- [ ] **Step 4: 提交**

```bash
git add tests/seo.test.mjs tests/css.test.mjs
git commit -m "test: add v3 TDD assertions (svg-frame, Let's Talk, nav-icon)"
```

---

### Task 2: index.html v3 结构调整

**Files:**
- Modify: `index.html`（86-97 hero 区、66-73 导航、118-122 统计、241-256 contact、260-265 footer）
- Test: `tests/seo.test.mjs`（Task 1 已加）

**Interfaces:**
- Consumes: Task 1 的断言契约（svg-frame/center1/data-count=14 静态/Let's Talk/nav-icon/Back To Top）。
- Produces: 稳定 DOM 结构供 Task 3 CSS 与 Task 4 浏览器验证使用。

- [ ] **Step 1: 导航加文件夹小图标 — 把 66-73 行 `nav-links` 的 6 个 `<a>` 各加一个图标 span**

把每个 `<a href="#...">` 的开头插入 `<span class="nav-icon" aria-hidden="true">▣</span>`，使结构变为：

```html
<div class="nav-links">
  <a href="#hero"><span class="nav-icon" aria-hidden="true">▣</span><span class="nav-num">01</span>首页</a>
  <a href="#about"><span class="nav-icon" aria-hidden="true">▣</span><span class="nav-num">02</span>关于我</a>
  <a href="#portfolio"><span class="nav-icon" aria-hidden="true">▣</span><span class="nav-num">03</span>作品集</a>
  <a href="#skills"><span class="nav-icon" aria-hidden="true">▣</span><span class="nav-num">04</span>设计能力</a>
  <a href="#life"><span class="nav-icon" aria-hidden="true">▣</span><span class="nav-num">05</span>生活</a>
  <a href="#contact"><span class="nav-icon" aria-hidden="true">▣</span><span class="nav-num">06</span>联系</a>
</div>
```

注意：锚点 href、`nav-num`、文本均不变。`aria-hidden="true"` 必须加，防读屏朗读装饰图标。

- [ ] **Step 2: Hero 大标题加行首 `#` 号（87-88 行）**

在 `hero-tag` 之后、`h1` 内名字前插入哈希装饰 span（不拆 h1、保持单 h1 契约）：

```html
<p class="hero-tag reveal"><span class="pulse-dot"></span>AIGC 时代设计师 · 14 年经验</p>
<h1 id="hero-title" class="hero-title reveal"><span class="hero-hash" aria-hidden="true">#</span>你好，我是<span class="hero-name">武红亮</span><span class="hero-role">AIGC 时代的 UI/UX 设计师</span></h1>
```

注意：h1 仍唯一、仍含 武红亮 与 AIGC（seo 测试契约不变）。`aria-hidden="true"` 防读屏朗读 `#`。

- [ ] **Step 3: Hero 视觉图替换为 `.svg-frame` 动效组**

把 95-97 行 `figure.hero-visual` 整体替换为（保留 `<figure class="hero-visual reveal">` 外层）：

```html
<figure class="hero-visual reveal">
  <div class="svg-frame" aria-hidden="true">
    <svg style="--i:0; --j:0" viewBox="0 0 344 344" role="presentation" focusable="false">
      <circle cx="172" cy="172" r="150" id="out1" fill="none" stroke="rgba(227,178,94,.5)" stroke-width="1.5"/>
    </svg>
    <svg style="--i:1; --j:1" viewBox="0 0 344 344" role="presentation" focusable="false">
      <circle cx="172" cy="172" r="140" id="out2" fill="none" stroke="rgba(227,178,94,.35)" stroke-width="1" stroke-dasharray="6 10"/>
    </svg>
    <svg style="--i:2; --j:2" viewBox="0 0 344 344" role="presentation" focusable="false">
      <circle cx="172" cy="172" r="130" id="out3" fill="none" stroke="rgba(227,178,94,.22)" stroke-width="1" stroke-dasharray="3 7"/>
      <circle cx="172" cy="172" r="120" id="inner1" fill="none" stroke="rgba(227,178,94,.25)" stroke-width="1"/>
      <circle cx="172" cy="172" r="100" id="inner3" fill="none" stroke="rgba(227,178,94,.18)" stroke-width="1" stroke-dasharray="2 8"/>
      <g id="center">
        <circle id="center1" cx="172" cy="172" r="34" fill="rgba(227,178,94,.92)"/>
      </g>
    </svg>
  </div>
</figure>
```

注意：原 `<img src="assets/avatar.svg" …>` 删除；`assets/avatar.svg` 文件保留（og:image 继续用它，不得删）。内联 SVG 上 `role="presentation" focusable="false"` 确保无焦点、无障碍安全。所有 CSS 引用的 id（`#out2` `#out3` `#inner1` `#inner3` `#center1` 及分组 `#center`）都必须真实存在于此处，否则 CSS 为死代码。

- [ ] **Step 4: About 统计条改造为 Mark91 式大字段（118-122 行）**

保持 `class="stats-grid"` 与 `data-count` 不变，仅调整内联视觉（数字已为静态终值 14/3，保持 `>14<`、`>3<` 不得回退成 0）。结构改为：

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

若该区块原样已满足，则注明"无需改动"并跳过（选择器验证：`data-count="14">14` 必须真存在）。**禁止**把 `>14<` `>3<` 改成 `>0<`。

- [ ] **Step 5: Contact 区块 Let's Talk 化（237-257 行）**

保持 `contact-heading`、`contact-grid`、三个 contact-cell（微信复制/邮箱/上海）不动，仅把 253-255 行 CTA 由按钮改为 Mark91 式大块：

```html
<div class="contact-cta reveal">
  <a class="button cta-gold cta-talk" href="mailto:wuhongliang55@163.com">
    <span class="cta-talk-title">Let's Talk</span>
    <span class="cta-talk-mail">wuhongliang55@163.com</span>
    <span class="cta-talk-arrow">→</span>
  </a>
</div>
```

保留 mailto、原 id（无 id）。`Let's Talk` 文本必须在 HTML 中出现（Task 1 断言）。

- [ ] **Step 6: Footer 加 Back To Top 文本（260-265 行）**

```html
<footer class="site-footer">
  <div class="container footer-inner">
    <p>© 2026 武红亮 · UI/UX &amp; AIGC 设计师 — 上海</p>
    <a href="#hero" class="back-to-top">Back To Top ↑</a>
  </div>
</footer>
```

若已含 `Back To Top` 则跳过。锚点 `#hero` 不变。

- [ ] **Step 7: 运行测试**

Run: `npm test`
Expected: `tests 27 | pass 26 | fail 1`（seo 两新测试通过；css 的 svg-frame 测试仍红，待 Task 3）

- [ ] **Step 8: 提交**

```bash
git add index.html
git commit -m "feat(html): apply v3 Mark91 layout to nav/hero/contact/footer"
```

---

### Task 3: style.css v3 视觉层

**Files:**
- Modify: `style.css`
- Test: `tests/css.test.mjs`

**Interfaces:**
- Consumes: Task 2 的 DOM（nav-icon、svg-frame/center1、cta-talk、back-to-top、stats 现有类）。
- Produces: v3 视觉；Task 4 浏览器验证对象。

- [ ] **Step 1: 附加 v3 视觉规则（追加在 `@media (prefers-reduced-motion: reduce)` 块之前，即 225 行前）**

```css
/* ---- v3 Mark91 layout language ---- */
.nav-links a { gap: 7px; }
.nav-icon { font-size: 11px; color: var(--accent); opacity: .75; transition: opacity .25s; }
.nav-links a:hover .nav-icon { opacity: 1; }

.hero-copy h1 .hero-hash { color: var(--accent); }

.svg-frame {
  position: relative;
  width: 300px;
  height: 300px;
  transform-style: preserve-3d;
  display: flex;
  justify-content: center;
  align-items: center;
}
.svg-frame svg {
  position: absolute;
  transition: .5s;
  z-index: calc(1 - (0.2 * var(--j)));
  transform-origin: center;
  width: 344px;
  height: 344px;
  fill: none;
}
.svg-frame:hover svg {
  transform: rotate(-80deg) skew(30deg) translateX(calc(45px * var(--i))) translateY(calc(-35px * var(--i)));
}
.svg-frame svg #center {
  transition: .5s;
  transform-origin: center;
}
.svg-frame:hover svg #center {
  transform: rotate(-30deg) translateX(45px) translateY(-3px);
}
#out2 {
  animation: rotate16 7s ease-in-out infinite alternate;
  transform-origin: center;
}
#out3 {
  animation: rotate16 3s ease-in-out infinite alternate;
  transform-origin: center;
  stroke: #ff0;
}
#inner3,
#inner1 {
  animation: rotate16 4s ease-in-out infinite alternate;
  transform-origin: center;
}
#center1 {
  fill: #ff0;
  animation: rotate16 2s ease-in-out infinite alternate;
  transform-origin: center;
}
@keyframes rotate16 {
  to { transform: rotate(360deg); }
}
.cta-talk { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; text-align: left; }
.cta-talk-title { font-size: clamp(40px, 8vw, 96px); font-weight: 800; letter-spacing: -.03em; line-height: 1; }
.cta-talk-mail { font-family: "Inter", sans-serif; font-size: 15px; color: rgba(16, 15, 13, .72); }
.cta-talk-arrow { font-size: 30px; line-height: 1; }
.back-to-top { font-family: "Inter", sans-serif; font-size: 12px; letter-spacing: .1em; color: var(--muted); transition: color .25s; }
.back-to-top:hover { color: var(--accent); }
```

注意：
- 命令逐字包含用户提供的 `.svg-frame` 规则与 `rotate16` 关键帧（以上为完整体现，事件注明 v3 专用注释行）。
- `#out3`/`#center1` `stroke/fill: #ff0` 按用户代码保留；`#center1` fill 会覆盖内联 SVG 的 `fill="rgba(227,178,94,.92)"`（CSS 胜，属预期）。
- 移动端 `.svg-frame` 需在 767 媒体查询内加：`.hero-visual { display: grid; place-items: center; }` 与 `.svg-frame { width: 260px; height: 260px; }`。**在 202-224 行 `@media (max-width: 767px)` 块内**补两条规则：

```css
.hero-visual { display: grid; place-items: center; }
.svg-frame { width: 260px; height: 260px; }
.svg-frame svg { width: 300px; height: 300px; }
```

- 若 `.svg-frame` 部分规则与既有 `.hero-visual img` 冲突：原 `img` 已删除，无冲突；`.hero-visual` 旧的 `width:100%` 等规则仍在（72 行），新规则只新增 display/place-items。

- [ ] **Step 2: 运行测试**

Run: `npm test`
Expected: `tests 27 | pass 27 | fail 0`

- [ ] **Step 3: 校验 CSS 无语法错误**

Run: `node --check` 不适用（CSS）。用 `python3 -c "import tinycss2; ..."` 若不可用则跳过；最低要求：`rg -c "svg-frame" style.css` ≥ 6（规则定义+引用），且 `git diff style.css` 无未闭合大括号。**若有 sih，则用以下命令校验括号配对**：

```bash
awk '/\{/{o++} /\}/{c++} END{print "open="o,"close="c}' style.css
```

Expected: `open=… close=…`（两数相等，如 v2 的 206/206）

- [ ] **Step 4: 提交**

```bash
git add style.css
git commit -m "feat(css): v3 Mark91 visual layer with svg-frame animation"
```

---

### Task 4: 浏览器验证 + 审计记录

**Files:**
- Modify: `docs/superpowers/plans/2026-09-17-portfolio-site-audit.md`（追加 v3 记录节）
- Tool: `/var/folders/dw/k4s73mrn24bf5hm2ntj0bjtc0000gn/T/opencode/v2-resp.mjs`（复用，扩查 `.svg-frame`）

**Interfaces:**
- Consumes: Task 3 成品；Test 26 项全绿。
- Produces: 实测数据写入审计文档。

- [ ] **Step 1: 运行完整测试套件两遍**

Run: `npm test && npm test`
Expected: 两次均 `tests 27 | pass 27 | fail 0`

- [ ] **Step 2: CDP 浏览器扫描（6 宽度 + v3 特性）**

复用 `v2-resp.mjs`（改动）：
- 确认 `python3 -m http.server 8123` 在根目录运行（已有则复用）。
- 在 evaluate 表达式追加：取 `.svg-frame svg` 数量（应 3）、`#center1` computed fill（应 `rgb(255, 255, 0)` 因 CSS `fill:#ff0` 生效）、`.svg-frame` 存在、hover 后（`DispatchMouseEvent` 或直接 evaluate 加 `:hover` 不可靠，改用 `CSS.forcePseudoState` 或跳过 hover 断言、记录 `getComputedStyle` 的 `transform` 基线）。
- 记录：overflow=0、marqueeCount=2、statNum=4、dataCount 值 ["14","3"]、folderCount=8、hasModal=true、svgFrameSvgs=3、center1Fill 实测值。
- 若 hover 断言不稳定，标注为"人工确认项"，不阻塞（规范要求 reduced-motion 下静止，此项在 Step 3 自动验证）。

- [ ] **Step 3: reduced-motion 验证**

在 CDP 里 `Emulation.setEmulatedMedia` 设置 `prefers-reduced-motion: reduce` 后刷新，断言 `.svg-frame` 内 `#out2` computed `animation-duration` 接近 `0.01ms`、`.marquee-track` `animation` 为 `none`。

- [ ] **Step 4: 追加审计节并提交**

在 `docs/superpowers/plans/2026-09-17-portfolio-site-audit.md` 追加：

```markdown
## v3 Mark91 版式语言 (2026-09-17)

- npm test：tests 27 | pass 27 | fail 0（两遍）
- CDP 6 宽度（375/390/430/1280/1440/1920）：横向溢出 0/0；marqueeCount=2；statNum=4（data-count 14/3 静态终值）；folderCount=8；hasModal=true；svgFrameSvgs=3
- #center1 computed fill 实测：`<记录值>`（预期 rgb(255,255,0)）
- reduced-motion：`#out2` animation-duration→0.01ms；.marquee-track animation→none ✓
- hover 展开：CDP forcePseudoState 或人工确认（记录结果）
```

把 `<记录值>` 替换为实测；若 hover 未能自动化记录，写"人工确认：hover 时三圈位移展开正常"。

- [ ] **Step 5: 提交**

```bash
git add docs/superpowers/plans/2026-09-17-portfolio-site-audit.md
git commit -m "docs: record v3 Mark91 verification in final audit"
```

---

### Task 5: 全分支复核与收尾

**Files:**
- Modify: 无（仅审阅）
- Read: `docs/superpowers/specs/2026-09-17-portfolio-site-design-v3-mark91.md`、`docs/superpowers/plans/2026-09-17-portfolio-site-v3-mark91.md`、`tests/*`

**Interfaces:**
- Consumes: Task 1-4 全部产物。
- Produces: 合并就绪判定（与 v2 相同的最终复核）。

- [ ] **Step 1: 复核规格覆盖**

逐条对照 spec 验收清单：`#` 大标题（hero）、svg-frame hover/rotate16、reduced-motion 静止、6 宽度无溢出、统计真实值、Let's Talk + 邮箱、作品网格/modal 正常。任何未覆盖项即缺陷。

- [ ] **Step 2: 复核测试无害性与一致性**

读 `tests/seo.test.mjs` 与 `tests/css.test.mjs` 全文件：新断言不删旧断言、不互相矛盾；`npm test` 全绿。

- [ ] **Step 3: 规格/实现偏差记录**

若实现与 spec 有偏差（如 hover 自动化未成、邮箱 regex 冲突），记录到 plan 的 Self-Review 或直接修复后提交。

- [ ] **Step 4: 交付总结**

向用户报告：测试 26/26、CDP 实测、改动清单、遗留（若有：hover 人工确认、Lighthouse 待重测等）。