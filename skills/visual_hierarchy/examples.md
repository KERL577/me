# 视觉层次 · 前后对比示例

全部示例主旨一致：靠 **对比的差异** 立层次，不靠装饰的数量。左侧=boring，右侧=有层次。

---

## 1 标题与正文：字号阶梯被抹平

```css
/* boring：所有文字都一样大、一样重 */
.hero h1 { font-size: 28px; }
.hero p  { font-size: 16px; color: #333; }
```

```css
/* hierarchy：拉大阶梯 + 字重 + 字距反向 */
.hero h1 { font-size: clamp(38px, 6vw, 64px); font-weight: 600; letter-spacing: -0.045em; text-wrap: balance; }
.hero h1 .focus-word { color: #7357b8; }
.hero p  { font-size: 17px; color: #6e7280; max-width: 34ch; }
```

为什么：第一眼落在 `h1`（最大 + 最重 + 聚焦词变色），正文退到灰色过渡区。

---

## 2 卡片：脏边框 vs 白卡 + hairline 描边

```css
/* boring：每张卡一套边框颜色/阴影，层次混乱 */
.card { border: 2px solid rgba(115,87,184,.4); box-shadow: 0 4px 20px rgba(0,0,0,.2); border-radius: 12px; }
```

```css
/* hierarchy：统一 token，hover 才给主色描边 + 轻浮起 */
.card { background:#fff; border:1px solid #e4e4e0; border-radius:18px; transition: transform .2s, border-color .2s; }
.card:hover { transform: translateY(-4px); border-color:#7357b8; }
```

为什么：层级由边框明暗决定，而不是每张卡抢焦点；hover 只动 2 个属性。

---

## 3 强调手法：裸 `<strong>` vs eyebrow + 聚焦词

```html
<!-- boring：strong 只是变粗，信息全平铺 -->
<div class="section-title">我的服务</div>
<p>我负责 <strong>UI 设计</strong> 和 <strong>品牌视觉</strong>，也做 <strong>AIGC</strong>。</p>
```

```html
<!-- hierarchy：eyebrow 预告主题，一个聚焦词高亮，其余弱化 -->
<p class="eyebrow">What I do</p>
<h2>把 <span class="focus-word">想法</span> 变成可用的产品</h2>
<p>UI 设计、品牌视觉、AIGC 内容一起交付。</p>
```

```css
.eyebrow { font-size:12px; text-transform:uppercase; letter-spacing:.14em; color:#7357b8; }
.focus-word { color:#7357b8; font-weight:600; }
```

为什么：一行只强调一个词，视线路径是"标签 → 标题 → 落在高亮词"。

---

## 4 配色：多主色混战 vs 单主色 + 中性

```css
/* boring：三四个强调色互相抢 */
a { color:#2f6fed; } .badge { background:#f59e0b; } .btn { background:#ef4444; color:#fff; }
```

```css
/* hierarchy：一个 accent，中性灰阶出信息层级 */
a { color:#7357b8; }
.badge { background:#e8e1f4; color:#7357b8; }   /* accent 8~12% 浅面 */
.btn-primary { background:#191a1d; color:#f7f7f4; }  /* 主按钮用墨色压场 */
.card:hover { border-color:#7357b8; }
```

为什么：焦点永远只属于主色；墨色按钮用明暗制造更硬的手段，反而更抢眼且不脏。

---

## 5 间距：均匀挤 vs 4 倍节奏

```css
/* boring：所有 margin 都是 12px，组内组间无差别 */
.module { margin: 12px; }
```

```css
/* hierarchy：组内 8-16px，组间 48-96px，section 留白更大 */
.module-inner gap: 12px;        /* 组内 */
.module + .module { margin-top: 64px; }  /* 组间 */
section { padding: clamp(64px, 10vw, 120px) 24px; }
```

为什么：间距的**倍数关系**本身就在编码结构——同距=同类，大距=换组。

---

## 6 动效：自嗨 vs 有方向

```css
/* boring：旋转 + 放大 + 变色一起上，700ms */
.cta:hover { transform: rotate(3deg) scale(1.1); background:#fff; transition: all .7s; }
```

```css
/* hierarchy：短位移淡入，方向=出场语义 */
.reveal { opacity:0; transform: translateY(16px); transition: opacity .3s ease, transform .3s cubic-bezier(.2,.8,.2,1); }
.reveal.in { opacity:1; transform:none; }

@media (prefers-reduced-motion: reduce) {
  .reveal { opacity:1; transform:none; transition:none; }
}
```

为什么：动效描述"东西从哪里来"，不抢焦点；reduced-motion 下内容立即可读。