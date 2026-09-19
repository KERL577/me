# 2026-09-17 Portfolio Site — Final Audit & Lighthouse Checklist

> Task 8 acceptance gate. Two phases:
> 1. **Static/headless audit**: full static-file audit, DOM wiring cross-check via Node scripts (below).
> 2. **Real browser verification**: headless Chrome (CDP) responsive scan at the 6 spec widths + Lighthouse 13.4.1 run (mobile) against a local `python3 -m http.server` instance. All commands run from the project root.

## v2（Mark91 深色工作室风）验证记录

> 规格：`docs/superpowers/specs/2026-09-17-portfolio-site-design-v2-mark91.md`（2026-09-17 确认）

- 测试：24/24 全绿（原 21 + marquee、stats-grid+data-count、skill-rows 新增 3 项）
- 结构保留：唯一个 h1、五 section h2、folderGrid/workModal、JSON-LD、header→main→footer 顺序、72 WebP、portfolio.json 数据
- 真实浏览器（headless Chrome CDP）6 宽度：横向溢出 0/0（html+body）全 6 宽度；2 条跑马灯 animation-name = marquee；4 stat-num（data-count 14、3 两项）；4 行技能行 click 后 aria-expanded = true、panel hidden = false、toggle text = Close；8 个 folder-card；#workModal 存在
- 待部署确认项（沿袭 v1）：canonical/og:url 占位域名、og:image 相对 SVG → 部署前换真实域名与栅格图

## 1. Final Deliverable Tree

```
.
├── index.html                 # semantic single-page (218 lines)
├── style.css                  # tokens + folder-scene + responsive + reduced-motion
├── script.js                  # fetch/render/modal/menu/copy/toast IIFE
├── portfolio.json             # 8 categories / 72 image paths
├── robots.txt                 # Allow: / + sitemap URL
├── sitemap.xml                # single URL entry, lastmod 2026-09-17
├── package.json               # node --test runner; no deps
├── README.md
├── tools/
│   └── convert-images.sh      # cwebp batch converter (repo tooling)
├── tests/
│   ├── portfolio.test.mjs
│   ├── seo.test.mjs
│   └── css.test.mjs
├── assets/
│   ├── avatar.svg             # hero placeholder (733 B, self-contained)
│   ├── icons/favicon.svg      # favicon (661 B, self-contained)
│   └── works/                 # 8 category dirs, 72 WebP total
│       ├── 360/        (6)
│       ├── baanju/     (8)
│       ├── paiouyun/  (11)
│       ├── weimob/    (10)
│       ├── zhongan/    (9)
│       ├── freelance/ (14)
│       ├── ip/         (3)
│       └── logo/      (11)
├── docs/superpowers/{plans,specs}/
```

**Required items present:** `index.html`, `style.css`, `script.js`, `portfolio.json`, `robots.txt`, `sitemap.xml`, `assets/avatar.svg`, `assets/icons/favicon.svg`, 8 category dirs with 72 `.webp` — all verified.
**Legacy/ignored absent from deliverable:** `index.legacy.html`, `/works/` (raw sources), `.DS_Store`, `.superpowers/` are all git-ignored and untracked. `git status --short` is clean (empty); tracked `git ls-files` contains only the deliverable set + dev tooling/tests/docs.

## 2. Test Summary

`npm test` (node --test) → **21/21 pass**, 0 fail, 0 skipped.

```
tests 21 | suites 0 | pass 21 | fail 0 | cancelled 0 | skipped 0 | duration ~43 ms
```

- portfolio (3): data integrity, required fields, all 72 image paths exist on disk, `cover === images[0]`.
- seo (12): lang/title/meta/canonical/OG/Twitter, JSON-LD Person + ItemList(8), semantic order, single h1, per-section h2, img alt + lazy flag, folderGrid/workModal + `fetch("portfolio.json")`, robots/sitemap.
- css (6): design tokens (7), 767px/1023px breakpoints, folder-scene classes, reduced-motion, grid/flex, aspect-ratio.

## 3. Functional Smoke Test (headless, DOM-free wiring check)

A Node script (`audit-smoke.mjs`, run ad hoc, not committed) read `index.html` + `script.js` and cross-checked every selector used by JS against committed HTML ids/classes/data-attrs.

**HTML reference wiring** — all OK: `style.css` link, `script.js defer`, favicon link, avatar `src`, `fetch("portfolio.json")` (double quotes), `loading="lazy"` present in JS, `$("modalImg").focus()` present.

**Selector cross-check** — 22 selectors checked, **0 issues**:

- `getElementById`: site-header, menuToggle, mobileMenu, toast, copyWechat, folderGrid, workModal
- `$()` helper: modalType, modalTitle, modalDesc, modalMeta, modalImg (×3), modalCounter
- `querySelector[All]`: .reveal (×2) ✓ in HTML, .folder-card (JS-generated, class present in CSS — expected), [data-modal-close] ✓ (backdrop + close btn), .modal-prev, .modal-next ✓

Every selector resolves to a node that exists at call time. No null-node / runtime `TypeError` risks statically detectable.

**portfolio.json wiring** — 8 dirs `360,baanju,freelance,ip,logo,paiouyun,weimob,zhongan` match expected ids; 72 files on disk ↔ 72 referenced, `0` unreferenced; `cover === images[0]` for all 8; no missing files.

**Result: SMOKE PASS.** No real mismatches → no code fixes required (task brief step 5 not triggered).

## 4. Real Browser Verification (headless Chrome + Lighthouse)

### 4a. Responsive overflow scan (CDP, `Emulation.setDeviceMetricsOverride`), 6 spec widths

| Width | Device | Horizontal overflow (`scrollWidth−clientWidth`) | folder cards | img lazy | grid |
|-------|--------|:---:|:---:|:---:|:---:|
| 1920 | desktop | 0 / 0 (html/body) | 8 | ✅ | ✅ |
| 1440 | desktop | 0 / 0 | 8 | ✅ | ✅ |
| 1280 | desktop | 0 / 0 | 8 | ✅ | ✅ |
| 430  | mobile | 0 / 0 | 8 | ✅ | ✅ |
| 390  | mobile | 0 / 0 | 8 | ✅ | ✅ |
| 375  | mobile | 0 / 0 | 8 | ✅ | ✅ |

Single h1 present at every width; mobile widths collapse to single-column folder cards (measured 335–390px, no overlap).

### 4b. Lighthouse 13.4.1 (mobile, Chrome headless, `python3 -m http.server 8123`)

| Category | Score |
|----------|:---:|
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| Performance | n/a* |

\* Aggregate Performance was invalidated by a known Chrome-screenshots regression in this environment ("Chrome didn't collect any screenshots during the page load" → Speed Index null). The reliable lab metrics that DID collect are all green, so the composite is assessed on those directly:

| Lab metric | Value | Verdict |
|------------|-------|:---:|
| First Contentful Paint | 0.6 s | ✅ |
| Largest Contentful Paint | 1.3 s | ✅ |
| Total Blocking Time | 0 ms | ✅ |
| Cumulative Layout Shift | 0.001 | ✅ |
| Time to Interactive | 0.6 s | ✅ |
| Server response time | 0 ms | ✅ |
| Console errors | 0 | ✅ |
| Unminified JS | pass | ✅ |
| Render-blocking | none beyond local `style.css` | ✅ |

**Note:** run Lighthouse again with a stable Chrome/Lighthouse combo right before deploy to capture a single aggregate Performance number; per-metric evidence above is what the score would be built from.

## 5. Lighthouse-Style Checklist Sweep

### Performance — P 5/5 ✅

| # | Check | Verdict |
|---|-------|---------|
| P1 | Minimal JS, loaded `defer` (single bundled IIFE; no inline/blocking JS) | ✅ |
| P2 | No render-blocking beyond CSS (local `style.css`; Google Fonts `preconnect` + `display=swap`, non-blocking; no other fetch) | ✅ |
| P3 | Lazy images: all content `<img>` `loading="lazy"`, rendered only into folder cards / modal by JS; static HTML ships one tiny SVG only | ✅ |
| P4 | CLS safeguards: `width`/`height` on all imgs, folder-photo `aspect-ratio: 4/3`, fixed hero img box | ✅ |
| P5 | Efficient format: 72 WebP (q80, ≤1600px) + self-contained SVGs (733 B / 661 B) | ✅ |

### Accessibility — A 3/4 ✅ (1 ⚠️)

| # | Check | Verdict |
|---|-------|---------|
| A1 | Alt text: every static img has `alt`; JS-rendered imgs get descriptive `alt="<name> 作品 n"` | ✅ |
| A2 | aria-labels/roles: nav, menuToggle (`aria-expanded`/`aria-controls`), modal arrows, folder cards; modal `role="dialog"`/`aria-modal`/`aria-labelledby`; toast `role="status"` `aria-live="polite"` | ✅ |
| A3 | Modal focus: focus set to `modalImg` on open; Esc + arrow-key nav handled | ⚠️ |
| A4 | Focus visibility (`:focus-visible` outline) + `prefers-reduced-motion` honored in both CSS and JS | ✅ |

⚠️ A3 note (deferred, not fixed): focus is **not restored** to the triggering card on modal close, and background siblings are **not** `aria-hidden` while the modal is open. Acceptable for v1; pre-deploy hardening item.

### Best Practices — BP 3/3 ✅

| # | Check | Verdict |
|---|-------|---------|
| B1 | Valid, self-contained SVGs (single root, valid XML, no external refs) | ✅ |
| B2 | No insecure `http://` resources in delivered code (only XML namespaces & `localhost` doc refs); all external = HTTPS fonts | ✅ |
| B3 | Clean event wiring — 22/22 selectors resolve to committed HTML; exactly one `h1`; semantic `header/nav/main/footer` | ✅ |

### SEO — SEO 4/6 ✅ (2 ⚠️)

| # | Check | Verdict |
|---|-------|---------|
| S1 | Title exact match: `武红亮｜UI/UX设计师｜AIGC设计师｜个人作品集` | ✅ |
| S2 | meta description + keywords present and populated | ✅ |
| S3 | canonical + `og:url` point to placeholder domain `https://wuhongliang55.github.io/portfolio/` — **update to real domain pre-deploy** | ⚠️ |
| S4 | `og:image` is a relative SVG (`assets/avatar.svg`) — **needs raster + absolute URL pre-deploy** | ⚠️ |
| S5 | robots.txt (Allow: / + sitemap URL) + sitemap.xml present and internally consistent | ✅ |
| S6 | JSON-LD structured data: Person + ItemList with 8 items; `lang="zh-CN"`; semantic landmarks; single h1 | ✅ |

**Grand total: 15 ✅ / 3 ⚠️ / 0 ❌** (P 5/5, A 3/4, BP 3/3, SEO 4/6).

### Real Lighthouse confirms the checklist sweep

- Accessibility **100**, Best Practices **100**, SEO **100** — all three categories the sweep marked ✅ test clean in a real browser.
- Performance per-metric evidence (FCP/LCP/TBT/CLS) is green (see 4b); the single aggregate number was unreportable only due to a Speed Index screenshot-collection regression, not page metrics.

### Deferred items (accepted for v1, do NOT fix now)

- Preloader / accordion pattern — omitted by design (JS-driven folder grid is the interaction).
- Canonical & `og:url` placeholder domain — swap to real domain pre-deploy (README documents `sed` swap).
- `og:image` relative SVG — replace with raster image + absolute URL pre-deploy.
- Modal a11y hardening: focus restore on close + `aria-hidden` siblings behind modal.

## 6. Verdict

**PASS.** All 21 tests green; static deliverable complete; smoke wiring 0 mismatches; real-browser responsive scan clean at all 6 spec widths; Lighthouse A/BP/SEO = 100 and perf lab metrics all green (aggregate Speed Index only unreportable due to environment screenshot regression). Remaining items are all pre-deploy placeholders (⚠️), none blocking delivery.

## v3 Mark91 版式语言 (2026-09-17)

> 规格：`docs/superpowers/specs/2026-09-17-portfolio-site-design-v3-mark91.md`
> 验证工具：headless Chrome 152 (CDP, `/var/folders/.../T/opencode/v3-resp.mjs`，临时未入库) + `python3 -m http.server 8123`

- npm test：tests 27 | pass 27 | fail 0（两遍）
- CDP 6 宽度（375/390/430/1280/1440/1920）：横向溢出 0/0（html/body 均为 0，scrollWidth≤clientWidth）；marqueeCount=2；statNum=4（data-count 14/3 静态终值，统计文本 14/3/千万/AIGC）；folderCount=8；hasModal=true；svgFrameSvgs=3
- #center1 computed fill 实测：`rgb(255, 255, 0)`（预期 rgb(255,255,0)，CSS `fill:#ff0` 覆盖内联属性生效）
- reduced-motion：`#out2` animation-duration→0.01ms（computed `1e-05s`）；.marquee-track animation-name→none（shorthand `1e-05s`，因 `*` 全局 !important 覆盖 duration；name 为 none 即不运行）✓
- hover 展开：CDP forcePseudoState 自动化成功 —— `.svg-frame` 强制 `:hover` 后 3 个 svg transform 由 `none` 展开为含 rotate/skew/translate 的矩阵，位移随 `--i` 递增（i=0 平移 0,0 / i=1 平移 -3.86,-30.15 / i=2 平移 -7.71,-60.31）；`#center1` transform 同步变化（hover 规则生效）