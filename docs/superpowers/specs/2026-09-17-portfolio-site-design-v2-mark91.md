# 武红亮个人设计师品牌网站 — 视觉改版 v2 设计文档（Mark91 深色工作室风）

> 日期：2026-09-17
> 状态：已获用户确认
> 关联：本文件是 `2026-09-17-portfolio-site-design.md`（v1，浅色文件夹风）的视觉改版。v1 的分支：组件交互/数据模型/SEO/测试 21 项保持不变。
> 项目根目录：`wuhongliang-portfolio/`

## 1. 改版定位与范围

v1 交付了「暖白 · 高级紫 · 日系极简」的 liuliulab 文件夹式作品集。用户审阅后希望整体视觉语言切换到 https://www.mark91studio.com/ 的气质：

**深色 · 大字排版 · 单色系 + 暖金强调 · 数字编号导航 · 跑马灯 · 滚动动态**。

**保留不动（v1 的既定资产）**：
- 折叠夹 `folder-scene` 作品集（结构、hover 展开、点击开弹窗、数据渲染）— 只换深色皮肤
- 单页信息架构 / 五个 H2 / 唯一 H1 / header→main→footer 顺序 / JSON-LD / OG meta / canonical
- `portfolio.json` 数据模型与 72 张 WebP
- 详情弹窗交互（翻页 / 键盘 / 点击遮罩关闭 / 微信复制 / toast）
- 21 项静态测试全部保持通过

**本次改动（视觉层 + 少量结构增强）**：
- 全站配色：暖黑底 + 暖白字 + 暖金强调
- 导航改为数字编号（桌面端）
- Hero / Section 标题超大字排版 + 英文衬字
- 新增两条跑马灯文字带
- 关于我新增金色大数字统计块（滚动计数）
- 设计能力改为编号行 + Open/Close 展开收起
- 联系方式改为大号金色 CTA（"Let's Talk" 气质）

## 2. 设计原则

1. **深色优先**：全站暖黑底，信息层级靠明度与字号而不是色相区分。
2. **大字编辑感**：标题用 clamp 大字号；装饰性英文衬字（DESIGNER / SELECTED WORKS / AIGC）铺在 section 背景，低对比。
3. **暖金单一强调色**：`--accent` 全站唯一情绪色，用于序号、sticker、CTA、hover 高亮、关键数字。
4. **克制动效**：进场揭示、滚动计数、跑马灯、hover 位移；`prefers-reduced-motion` 下全部降级为静态。
5. **兼容保持**：断点、测试、语义、无障碍、SEO 均不倒退。

## 3. 信息架构（不变）

索引 `index.html`（改动标记 ✎）：

```
<body>
├─ <header> ✎ 数字编号导航（桌面）：01 首页 / 02 关于我 / 03 作品集 / 04 设计能力 / 05 生活 / 06 联系；移动端汉堡菜单不变
├─ <main>
│  ├─ Hero ✎ 超大标题 + 英文衬字 "DESIGNER"
│  ├─ ✎ 跑马灯文字带 #1
│  ├─ Section 关于我（H2）✎ 新增 stats 大数字计数
│  ├─ Section 我的作品集（H2）— folder-grid 不动（仅深色皮肤）
│  ├─ ✎ 跑马灯文字带 #2
│  ├─ Section 设计能力（H2）✎ 编号行 + Open/Close 展开
│  ├─ Section 我的生活与爱好（H2）— 卡片仅换肤
│  └─ Section 联系方式（H2）✎ 大号金色 CTA
├─ <footer> 版权 / 回到顶部（仅换肤）
└─ 详情弹窗 #workModal + toast（交互不变，仅换肤）
```

## 4. 视觉规范 v2

### 4.1 色板（token 名保持不变，CSS 测试零破坏）

| Token | v1 值 | v2 值 | 用途 |
|-------|-------|-------|------|
| `--bg` | `#f7f6f3` | `#100f0d` | 暖黑页面底 |
| `--surface` | `#ffffff` | `#1a1917` | 卡片/弹窗/导航底 |
| `--ink` | `#191919` | `#f0e9dd` | 暖白主文本 |
| `--muted` | `#76706a` | `#9a9183` | 次级文本/衬字 |
| `--accent` | `#6f5bd1` | `#e3b25e` | 暖金强调 |
| `--accent-soft` | `#ece8f8` | `rgba(227,178,94,.12)` | 金色轻背景/星号 |
| `--border` | `#e6e4e0` | `#2a2825` | 分隔线/描边 |
| `--selection` | — | `rgba(227,178,94,.28)` | 选中高亮 |
| `--folder-back` | — | `#26231f` | 文件夹背面 |
| `--folder-front` | — | `#322e28` | 文件夹正面 |

原则：纯黑 `#000` 不用，全部暖化；强调色只有一档暖金；文本用暖白避免冷白刺眼。

### 4.2 字体与排版

- 中文：PingFang SC / Hiragino Sans GB / Microsoft YaHei（系统栈）
- 英文：Inter（Google Fonts 现链接改为 `wght@400;500;600;700;800`，`display=swap` 不变）
- 标题超大字级：`clamp(2.6rem, 6vw, 5rem)`；section H2 `clamp(2rem, 4vw, 3.4rem)`；font-weight 700–800；`letter-spacing: -0.02em`
- Section 头部仍是 `eyebrow`（英文小字）+ H2，但 eyebrow 改为金色 + 更大字距
- 英文衬字：`.outline-text` — section/hero 背景大号英文（如 SELECTED WORKS / AIGC / PORTFOLIO），`-webkit-text-stroke` 或低对比实色，`aria-hidden="true"`

### 4.3 布局

- 容器仍最大 1180px；section 垂直留白 `clamp(96px, 12vw, 160px)`
- 断点不变：≥1024 / 768–1023 / ≤767（CSS 测试覆盖的存在断言不受影响）

## 5. 组件设计 v2

### 5.1 数字编号导航（桌面端）

`.nav-links` 改列表（保持 `<nav>` 语义与链接文本，移动汉堡不变）：

```
01 首页   02 关于我   03 作品集   04 设计能力   05 生活   06 联系
```

- 序号金色细字（`.nav-num`），链接仍为 `<a href="#about">` 等，文本必须包含原链接文字（如「关于」→「02 关于我」？**保持 href 文本 = 中文名**，序号用 `<span>` 装饰，避免破坏导航可达性）
- 具体结构：`<a href="#about"><span class="nav-num">02</span>关于我</a>`
- 滚动越过 Hero 后加 `.is-scrolled` 毛玻璃底（现有逻辑保留）
- 激活态：当前锚点高亮金色（IntersectionObserver 或点击高亮，可简化）

### 5.2 Hero

- `.hero-outline` 现有 "WU HONGLIANG" 保留并放大
- H1 保留（seo 测试要求唯一 H1 含「武红亮」+「AIGC」）：字号放大、`hero-name` 金色
- 新增 `.hero-marquee` 或放跑马灯在 Hero 底部（见 5.4）
- avatar SVG 保留但加金色描边圆框

### 5.3 关于我 + 大数字统计

现有 `.stats` 区升级 `.stats-grid`：

```
14+    年设计经验       3   家头部企业     千万  级用户产品     AIGC  深度实践者
```

- 数字用金色大字，滚动进入视口时从 0 计数到终值（`.reveal` 触发 + IntersectionObserver）
- `data-count` 计数逻辑：静态渲染仍需有终值（SEO/无 JS 可见），JS 只在揭开时播放动画
- 注意「千万」与「AIGC」非纯数字：终值保留文本，动画仅对纯数字项（14+、3）生效；非数字项直接淡入
- `prefers-reduced-motion`：直接静态显示终值

### 5.4 跑马灯文字带（两条）

纯 CSS 循环滚动：

```
<!-- #1 位置：Hero 与 关于我 之间 -->
<div class="marquee" aria-hidden="true">
  <div class="marquee-track">
    <span>UI/UX 设计师 · AIGC 设计师 · AI 网站设计 · 品牌视觉 · 数字人 · Blender ·</span>
    <!-- 重复一份 track 内容实现无缝循环 -->
  </div>
</div>

<!-- #2 位置：作品集 与 设计能力 之间 -->
<span>SELECTED WORKS · BRAND · UX · AIGC · WEB · 2014→2026 ·</span>
```

- `.marquee-track` 内含两份相同内容，`animation: marquee 28s linear infinite`
- `@media (prefers-reduced-motion: reduce)` → `animation: none`
- `aria-hidden="true"`（纯装饰）
- 西文条可大小写混合；金色 `·` 分隔，文本 muted

### 5.5 设计能力 → 编号行 + Open/Close

`.skills-groups` → `.skill-rows`（语义：`<div class="skill-row">`，标题 `<button>` 或 `<h3>` + 按钮）：

```
01  UI/UX 设计           [Open / Close]
      （展开：Web 设计 · APP 设计 · B 端产品 · … 标签或短文）
02  AIGC 创意            [Open / Close]
03  品牌与 Logo          [Open / Close]
04  B 端产品             [Open / Close]
```

- 每行：编号（金色）+ 标题 + 右侧 `+`/`−` 指示（或 Open/Close 文本）
- 点击整行切换 `.open`，内容区 max-height 过渡展开
- 保持 H2「设计能力」；行标题用 `<button>`（无障碍语义），展开面板为 `<div>`
- **注意**：v1 已将技能从标签卡实现；本次改动 "设计能力 / CAPABILITIES" 标题与所在 section 保持不变，只改行结构与展示 —— seo 测试（H2 文本存在）不受影响
- 移动端：编号行仍可用；避免汉堡菜单与触屏冲突
- `prefers-reduced-motion`：展开瞬间完成（不播放过渡）

### 5.6 联系方式 → 大号金色 CTA

- `.contact-cta` 放大：`预约设计合作` → 大号金色按钮或文字链接 `Let's Talk → 预约设计合作`
- 金色 hover 下划线动画；微信复制卡片、邮箱、地址保留原结构
- 保持按钮语义 `<a>` / `<button>` 不变（无障碍）

### 5.7 折叠夹作品集（皮肤换深色）

保留 v1 的 folder-scene 结构类（folder-grid/folder-card/folder-scene/folder-back/folder-front/folder-photo/folder-sticker —— CSS 测试断言里这些类名保持），仅换：
- folder-front/folder-back → `--folder-front` / `--folder-back`
- sticker → 金色底 / 黑色字（或金色字）
- folder-name → 暖白大字；folder-meta → muted
- hover 展开、点击开弹窗逻辑零改动

## 6. 动效清单

| 动效 | 触发 | 实现 | reduced-motion |
|------|------|------|----------------|
| 进场揭示 `.reveal → .is-visible` | IntersectionObserver | CSS opacity/transform | 类不给过渡系数，直接显示 |
| 大数字滚动计数 | IO 进入 `.stats` 数字 | JS `requestAnimationFrame` 计数插值 | 直接终值 |
| 跑马灯滚动 | 页面载入 | CSS `keyframes marquee` | `animation: none` |
| 技能行展开 | 点击 | CSS `max-height`/`grid-template-rows` 过渡 | 无过渡瞬间展开 |
| hover 位移/金色发光 | hover | CSS | 无影响 |

全部进入现有 `script.js`（单文件，保持轻量）或纯 CSS；不引入新库。

## 7. 测试计划（TDD 增量）

现有 21 项**全部保持通过**。新增 3 项（测试文件有明确归属）：

1. `tests/css.test.mjs`：`style.css` 含 `.marquee` 与 `@keyframes marquee`（跑马灯纯 CSS）
2. `tests/seo.test.mjs`：`index.html` 含 `class="stats-grid"` 及数字项带 `data-count` 属性（统计块存在）
3. `tests/seo.test.mjs`：`index.html` 含 `class="skill-rows"` 结构（技能编号行存在）

新测试先红（v1 代码缺这些类），实现 v2 后转绿。

## 8. 性能与无障碍（不倒退要求）

- 无新字体下载（Inter 提权到 800 属同一文件族）；无新图片
- 跑马灯与统计块纯 CSS + 少量 JS；Lighthouse Performance/SEO/无障碍 目标 ≥ v1 实测（A/BP/SEO 100，FCP/LCP 指标不回退）
- 所有新增交互元素带可用的语义/标签（跑马灯 `aria-hidden`、行按钮有 aria-expanded、统计数字有 aria-label 或文本可见）

## 9. 交付文件（改动清单）

| 文件 | 改动 |
|------|------|
| `index.html` | 导航编号、Hero 放大、跑马灯×2、关于区 stats-grid、技能区 skill-rows、CTA 放大、theme-color 改暖黑 |
| `style.css` | 全部 token 换 v2 值；新增 marquee / stats-grid / skill-rows / nav-num / outline-text / contact CTA 样式；改 folder-scene 皮肤、modal 皮肤 |
| `script.js` | IO 计数动画、技能行展开切换；保持 fetch/渲染/弹窗/复制 |
| `tests/*.test.mjs` | 新增上述 3 项断言；既有断言不改 |
| `README.md` |（可选）截图/描述微调 |
| 其余 | 不动（portfolio.json / WebP / robots / sitemap / favicon / avatar） |

## 10. 范围外（YAGNI）

- 不做真 Type 动画/碎裂特效；不做音效；不做英文全站切换
- 不做新图片素材；avatar 保持 SVG 占位
- 不引入 CSS 框架或 JS 库