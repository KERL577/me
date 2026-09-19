# 武红亮个人设计师品牌网站 — 设计文档

> 日期：2026-09-17
> 状态：已获用户确认
> 项目根目录：`wuhongliang-portfolio/`

## 1. 项目定位

AIGC 时代 UI/UX 设计师的个人作品展示网站。定位为「现代、极简、高级、日系个人 Portfolio 风格」，参考 https://liuliulab.org 。目标是：展示作品集、展示设计能力、吸引企业客户与合作机会、SEO 友好、建立个人设计品牌。

**核心约束**：纯静态（HTML5 + CSS3 + 原生 JS，无大型框架）、快速加载、SEO 优化、响应式（1920/1440/1280 + 375/390/430）、作品数据由 `portfolio.json` 驱动、禁止复杂动画与页面臃肿。

## 2. 现状与素材

- 源图：`/Users/wuhongliang/项目/me/作品集/` 共 8 个分类、72 张图（69 PNG + 3 JPG）
  - 360作品(6)、百安居作品(8)、派欧云作品(11)、微盟作品(10)、众安作品(9)、自己接单作品(14)、IP形象设计作品(3)、logo设计作品(11)
  - 文件名为纯数字（如 `1.png`），分类身份只存在目录名中
- 旧版网站 `index.legacy.html`（已备份）含完整经历/作品数据，供复用文案（经历年份、奖项、联系方式）

## 3. 信息架构

单页 + 详情弹窗结构。页面锚点导航：

```
index.html
├── <header> 固定导航：关于 / 作品 / 能力 / 生活 / 联系
├── <main>
│   ├── Hero 首屏（左标题右视觉）
│   ├── Section 关于我（H2）
│   ├── Section 我的作品集（H2，文件夹式）
│   ├── Section 设计能力（H2，视觉标签）
│   ├── Section 我的生活与爱好（H2）
│   └── Section 联系方式（H2）
├── <footer> 版权 / ICP 占位
```

### 3.1 Hero
- 左侧：`H1` 「你好，我是武红亮」 + 副标题「AIGC 时代的 UI/UX 设计师」 + 简介（14年设计经验，专注互联网产品体验、AI辅助设计、品牌视觉）+ 按钮「查看作品集」「联系合作」
- 右侧：个人照片 / 3D 人物 / 动态视觉占位（无真人照片则用「武」字头像 SVG 占位）

### 3.2 关于我
- 14 年设计行业经验，横跨品牌设计 / 互联网产品设计 / 软件产品设计 / AIGC 设计
- 曾服务：360、众安保险、微盟
- 强调「传统设计能力 + AI 时代设计工作流」
- 含统计数字卡（14+ 年经验、服务企业数、服务用户量级等）

### 3.3 我的作品集（文件夹式）
- 8 个分类文件夹，采用 liuliulab.org 的 `folder-scene` 设计：
  - `folder-card`（button）→ `folder-scene` → `folder-back` / `folder-front` / `folder-photo`(4张) / `folder-sticker`
  - 悬停/展开时文件夹打开，内部照片散开露出
- 每个文件夹信息：分类名、作品类型、简介、年份
- **点击文件夹** → 打开全屏详情弹窗：分类标题 + 简介 + 标签 + 全部图片（前后翻页 + 关闭 + 键盘控制）
- **移动端**：无 hover，展开状态由详情弹窗承担 —— 点击文件夹直接打开详情弹窗
- 数据来自 `portfolio.json`

8 个分类文案：

| id | name | type | description | company | year |
|----|------|------|-------------|---------|------|
| 360 | 360 作品 | 软件产品设计 | 负责 360 安全卫士体验设计，服务数亿用户的安全软件界面优化。 | 奇虎360 | 2014–2017 |
| baanju | 百安居作品 | 零售×AIGC 设计 | 数字人形象定制、IP 吉祥物数智化设计与线上产品支持。 | 百安居 | 2024 |
| paiouyun | 派欧云作品 | 网站与 AIGC 设计 | 产品官网设计、AI 图片生成、宣传短视频与数字人定制。 | 派欧云 | 2024 |
| weimob | 微盟作品 | B 端产品设计 | 负责 B 端产品用户体验设计，主导核心产品方案与团队交付。 | 微盟 | 2020–2023 |
| zhongan | 众安作品 | 移动端产品设计 | 优化众安保险 APP 购买与理赔流程体验，覆盖 C 端金融场景。 | 众安在线 | 2018–2020 |
| freelance | 自己接单作品 | 商业设计 | 独立承接的品牌视觉与数字化设计项目。 | 独立项目 | 各时期 |
| ip | IP 形象设计作品 | IP 与吉祥物设计 | IP 形象与吉祥物创意设计，探索 AIGC 辅助角色创作。 | 各品牌 | 2024 |
| logo | Logo 设计作品 | 品牌视觉设计 | Logo 与标志系统设计，涵盖多行业品牌。 | 各品牌 | 2012–今 |

### 3.4 设计能力
视觉标签墙：UI/UX设计、Web设计、APP设计、B端产品、AIGC设计、AI图片生成、数字人设计、品牌设计、视觉设计。
用分组的标签卡展示（A.产品体验 / B.AIGC与技术 / C.视觉与品牌）。

### 3.5 我的生活与爱好
- 摄影、旅行、AI实验、Blender、视频创作、生活记录
- 用户暂无照片 → 先用贴纸/宝丽来样式占位（后续可替换图片）
- 人格化，增加个人品牌温度

### 3.6 联系方式
- 微信（189 0196 2352，可复制）、邮箱（wuhongliang55@163.com）、社交媒体占位
- CTA 按钮「预约设计合作」
- Footer：© 2026 武红亮，回到顶部

## 4. 数据模型（portfolio.json）

`portfolio.json` 驱动**作品分类数据**（用户明确要求作品数据不写死）。关于/能力/生活/联系方式等正文保留在 HTML 中——对 SEO 更友好（爬虫直接读取正文），且这些内容变化频率低。

```json
{
  "categories": [
    {
      "id": "360",
      "name": "360 作品",
      "type": "软件产品设计",
      "company": "奇虎360",
      "description": "...",
      "year": "2014–2017",
      "tags": ["软件产品", "千万级用户"],
      "cover": "assets/works/360/1.webp",
      "images": ["assets/works/360/1.webp", "..."]
    }
  ]
}
```

分类可用单个「作品」粒度（title+cover+description+year），但本项目以「分类文件夹」为作品粒度，文件夹详情内为多图。数据读取：`fetch('portfolio.json')` + 兜底（fetch 失败时展示降级提示）。

## 5. 视觉设计规范

- 色板：`--bg:#f7f6f3`（暖白）/ `--surface:#ffffff` / `--ink:#191919` / `--muted:#76706a` / `--accent:#6f5bd1`（高级紫）/ `--accent-soft:#ece8f8` / `--border:#e6e4e0`
- 字体：中文 PingFang SC / Hiragino Sans GB / Microsoft YaHei；英文 Inter（Google Fonts，preconnect + display=swap）
- 布局：容器最大 1180px，大量留白；section 上下留白 128px（桌面）/ 80px（移动）
- 卡片：圆角 14–18px，轻阴影 `0 12px 32px rgba(...)`
- 动效：仅轻量 CSS —— hover 位移、淡入进场（IntersectionObserver 加 `.is-visible`，`prefers-reduced-motion` 时禁用）
- 背景质感：可选极淡噪点（SVG turbulence，opacity .025，同参考站）

### 响应式断点
- ≥1024：桌面布局
- 768–1023：平板（文件夹 2 列、细节调整）
- ≤767：移动（单列、汉堡菜单、文件夹竖排）

## 6. 图片处理方案

- 用 macOS 自带 `sips` 将 72 张源图批量转 WebP（quality 80），并缩放到最长边 ≤1600px
- 输出到 `assets/works/<category_id>/<n>.webp`
- 保留源图（不改动 `/Users/wuhongliang/项目/me/作品集`）
- 所有 `<img>` 使用 `loading="lazy"` + 明确 `width/height` 或 `aspect-ratio` 防 CLS + `alt`
- 提供 `tools/convert-images.sh` 脚本以便以后重新生成
- Hero 头像：无真人照片用 SVG「武」字占位
- 生活模块：使用生成的贴纸占位图（SVG 内联或占位色块）

## 7. SEO 方案

- `<title>武红亮｜UI/UX设计师｜AIGC设计师｜个人作品集</title>`
- meta description：14年UI/UX设计经验，曾任职360、众安保险、微盟。专注AI设计、互联网产品体验设计、网站设计和AIGC创意。
- meta keywords：UI设计师、UX设计师、AIGC设计师、AI网站设计、产品设计、上海UI设计师、个人作品集
- OG / Twitter Card 标签
- JSON-LD：`Person` + `ItemList`/`CreativeWork` 结构化数据
- 语义化：header / nav / main / section / article / figure / footer；H1 唯一含「武红亮 - AIGC时代UI/UX设计师」；各 section H2
- 每张图带富有含义的 alt
- `robots.txt` + `sitemap.xml`
- `lang="zh-CN"`、`canonical`

## 8. 性能约束

- 无第三方 JS 库、无大动画库
- JS：单个轻量 `script.js`（数据渲染、IntersectionObserver、弹窗、复制微信、导航）
- CSS：`style.css` 模块化分区
- 图片懒加载 + WebP
- 目标 Lighthouse：Performance >90、SEO >95

## 9. 测试方案（TDD，先写测试再实现）

用 Node 内置 `node --test`（无第三方依赖）编写静态测试 `tests/`：

1. `portfolio.test.mjs`：`portfolio.json` 结构完整（字段齐全、id 唯一、图片路径对应的文件真实存在、cover 在 images 中、非空）
2. `seo.test.mjs`：`index.html` 含 title、description、keywords、OG、JSON-LD、canonical、lang、唯一 H1、语义化标签、图片都有 alt、首图外均 lazy
3. `css.test.mjs`：`style.css` 含响应式断点（max-width: 767px / 1023px）、CSS 变量、prefers-reduced-motion
4. `html.test.mjs`（可选）：HTML 标签配对 / 结构顺序 header→main→footer

运行：`node --test tests/`（或 `npm test`）。

## 10. 交付文件

```
index.html
style.css
script.js
portfolio.json
assets/works/<category>/*.webp
assets/icons/（favicon.svg 等）
robots.txt
sitemap.xml
README.md（本地运行 + Cloudflare Pages / Vercel / GitHub Pages 部署）
package.json（npm test）
tests/*.test.mjs
tools/convert-images.sh
docs/superpowers/…
```

## 11. 部署方式

- 本地运行：`python3 -m http.server 8000` 或 Node `npx serve`
- GitHub Pages：推送到 gh-pages / Actions 静态部署
- Cloudflare Pages / Vercel：静态目录直接部署（无构建命令）

## 12. 范围外（YAGNI）

- 不做后台管理面板（作品更新 = 编辑 portfolio.json + 放入图片）
- 不做访客计数等服务端功能（保持纯静态）
- 不做多页路由