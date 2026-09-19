# 武红亮作品集 v3 — Mark91 版式语言吸收（设计文档）

- 日期：2026-09-17
- 状态：已确认（设计通过，待实现）
- 关联：v2 spec（2026-09-17-portfolio-site-design-v2-mark91.md）、v2 实现（已合并 main）

## 背景与目标

用户反馈：v2 仅按文字描述"Mark91 深色画册风格"主观发挥，**没有实际对照真实站点**
`https://www.mark91studio.com/studio`。新版以真实站点的版式语言为参考，但
**内容保持武红亮个人作品集**——不借用 Mark91 的团队/客户/奖项素材。

参考站 `mark91studio.com/studio` 的真实版式特征：
- 文件夹图标 + 编号导航（01 Home / 02 Studio / …）
- H1 超大标题（"# We make remarkable Design"，行首 `#`）
- 统计条大字段（International Design Studio / 4.8 Client Review / 98% Client Retention / 13 Creative Brain）
- Let's Talk 金色按钮高频出现
- Founders Desk 宣言段 + 署名、团队卡片、Awards、客户 logo 跑马灯、多办公地点页脚

## 决策记录

- 用户选定方向：**"只吸收版式语言，内容保持个人作品集"**
- `.svg-frame` Hero 视觉模块：用户提供了逐字 CSS，**中心为纯装饰金色核心**
  （不使用头像人像）
- 统计字段：**用现有真实值**（不引入团队向 98%/13 等造假数字）
- 联系邮箱：**真实邮箱 `wuhongliang55@163.com`**（取自 git config）

## 第 1 节：页面架构

保持单页结构，不改多页面。不动 `portfolio.json`、作品数据、assets/works/**、robots、
sitemap、favicon、avatar.svg。

| 区块 | v2 现状 | v3 改法 |
|---|---|---|
| 导航 | 武 品牌 + 06 编号 | 文件夹小图标 + `#` 样式编号导航，扁条、无深块 |
| Hero | "你好，我是武红亮…" | 首行 `#`，大标题；右置 `.svg-frame` 金色旋转装饰核心 |
| 跑马灯 | 单条技能词 | 保留，深底金色描边字 |
| About | 常规段 + stats-grid | 统计改为 Mark91 式大数字+标签并排字段，用真实值 |
| 作品 | 文件夹网格 | 保留（数据驱动），浅线卡片 + 金色 hover |
| 能力 | 编号技能行 | 保留 Open/Close 展开，金色编号 |
| Contact | 表单 | Mark91 式 Let's Talk 大标题 + email 大块 + 金色 CTA |

## 第 2 节：视觉系统与 Hero `.svg-frame` 模块

- 设计令牌：**复用 v2 令牌**（`--bg:#100f0d`、`--accent:#e3b25e`、`--ink:#f0e9dd`、
  `--border`、`--surface` 等），不新增命名
- 断点 767/1023 不变
- 微调：muted 灰稍提亮、边框略柔，突出金色

Hero 视觉模块结构调整：

```html
<figure class="hero-visual reveal">
  <div class="svg-frame">
    <svg style="--i:0; --j:0">…外层实线圆…</svg>
    <svg style="--i:1; --j:1">…外层虚线圆…</svg>
    <svg style="--i:2; --j:2"><circle id="center1"/>金色核心</svg>
  </div>
</figure>
```

- 3 层 SVG 各带 `--i`/`--j`，hover 按公式位移+斜切形成 3D 展开
- `#out2`/`#out3`/`#inner1`/`#inner3` 按 `rotate16` 7s/3s/4s 交替旋转
- 中心 `#center1` 金色圆 2s 旋转脉冲
- `prefers-reduced-motion: reduce` 下动画停用、图静止
- 桌面 hero：左文案右动效；移动端 300px 图居中置顶
- `assets/avatar.svg` 文件保留，仅不再用于 hero `<img>`（og:image 继续引用）

`.svg-frame` 相关 CSS 逐字收录用户提供的代码（含 `--i`/`--j` 自定义属性、
`rotate16` 关键帧、hover 变换公式）。

## 第 3 节：区块级调整

- **About 统计条**（Mark91 大字段观感，现有真实值）：
  `14+` 年设计经验 / `3` 家头部企业服务 / `千万`级用户产品 / `AIGC` 深度实践者
- **Marquee**：保留双条技能词，深底金色描边字，跑动频率不变
- **技能行**：保留 Open/Close 展开，编号更粗、金色编号
- **Contact/Footer（Let's Talk 化）**：
  - 巨大 `Let's Talk` 标题 + email 大块 `wuhongliang55@163.com` + 金色 CTA
  - 页脚：单行作者信息 + Back To Top，去掉多办公地点

## 第 4 节：测试与验收

- 不新增依赖
- 保留现有 24 项测试全绿：六个 h2 文案、`folderGrid`/`workModal` id、
  `fetch("portfolio.json")`、`loading="lazy"`、CSS 令牌与断点 767/1023
- TDD：为先 `.svg-frame`、Hero 金色装饰、Let's Talk 样式新增断言，再实现
- CDP 浏览器验证：6 宽度扫描 + hover 动效 + reduced-motion，新增校验
  `.svg-frame` hover 变换生效
- 提交策略同 v2 流程（子代理逐任务实现、逐任务审）

## 验收清单

- [ ] 24 项测试全绿
- [ ] `.svg-frame` hover 3D 展开 + rotate16 动画生效
- [ ] `prefers-reduced-motion: reduce` 下 `.svg-frame` 静止
- [ ] 6 宽度 CDP 无横向溢出
- [ ] 统计显示 14+/3/千万/AIGC 真实值
- [ ] Contact 显示 Let's Talk + `wuhongliang55@163.com`
- [ ] portfolio.json 作品网格正常渲染，modal 可用