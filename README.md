# 武红亮 — 个人作品集网站

纯静态单页设计师作品集，面向 UI/UX 设计师、AIGC 设计师岗位展示。零框架、零构建依赖，部署后即可上线。

---

## 预览

本地启动后访问 `http://localhost:8000`，页面包含：Hero / 关于 / 作品（文件夹卡片）/ 能力 / 生活 / 联系。

---

## 目录结构

```
.
├── index.html          # 主页面（语义化 HTML）
├── style.css           # 样式（CSS Variables + 响应式）
├── script.js           # 交互（文件夹渲染 / 弹窗 / 导航）
├── portfolio.json      # 作品数据（8 个分类，72 张图）
├── robots.txt          # 搜索引擎抓取规则
├── sitemap.xml         # 网站地图
├── assets/
│   ├── icons/favicon.svg   # 网站图标（SVG）
│   ├── avatar.svg          # Hero 形象占位（SVG）
│   └── works/<category>/   # WebP 作品图（8 分类）
├── tools/
│   └── convert-images.sh   # 原图批量转 WebP 脚本
└── tests/
    ├── portfolio.test.mjs   # 作品数据完整性
    ├── seo.test.mjs         # SEO / HTML 结构检查
    └── css.test.mjs         # 样式规范检查
```

---

## 本地运行

```bash
# 方式 1：Python 内置服务器
python3 -m http.server 8000

# 方式 2：npm script（等价）
npm run serve
```

然后浏览器打开 `http://localhost:8000`。

---

## 运行测试

```bash
npm test
```

期望输出：`3 tests passed`（portfolio）+ `12 tests passed`（seo）+ `6 tests passed`（css），共 21 项全部绿灯。

---

## 重新生成图片

源图片位于 `/Users/wuhongliang/项目/me/作品集`（仅本机），执行：

```bash
chmod +x tools/convert-images.sh
./tools/convert-images.sh
```

需要 macOS 安装 `cwebp`（Homebrew：`brew install webp`）。输出至 `assets/works/<category_id>/`。

---

## 部署

本项目为纯静态站点，无构建步骤，直接将项目根目录设为静态目录即可。

### Cloudflare Pages

1. 将代码推至 GitHub 仓库。
2. 登录 Cloudflare Dashboard → Pages → Create a project。
3. 连接 GitHub 仓库，**Build settings** 选 "None"（无构建命令）。
4. **Build output directory** 填 `/`（根目录）。
5. 部署完成后获得 `https://<your-subdomain>.pages.dev` 域名。

### Vercel

1. 将代码推至 GitHub 仓库。
2. 登录 [vercel.com](https://vercel.com)，Import Git Repository。
3. Framework Preset 选择 **"Other"**（或 Vercel 会自动识别为静态站点）。
4. 无需填写 Build Command 和 Output Directory。
5. 部署完成后获得 `https://<your-project>.vercel.app` 域名。

### GitHub Pages

1. 将代码推至 `main` 分支。
2. 仓库 → Settings → Pages → Source 选择 **Deploy from a branch**，分支选 `main`，目录选 `/`（根目录）。
3. 保存后等待几分钟，获得 `https://<username>.github.io/<repo>/` 域名。
4. 若仓库名不是 `portfolio`，部署路径为子目录，需确保 `robots.txt` 和 `sitemap.xml` 中的 Sitemap URL 与实际路径匹配。

---

## SEO 部署说明

部署到正式域名后，务必做以下替换：

1. **更新 Sitemap 和 robots.txt 中的域名**

   将 `wuhongliang55.github.io/portfolio` 替换为你的实际域名和路径：

   ```bash
   sed -i 's|wuhongliang55.github.io/portfolio|your-domain.com|g' robots.txt sitemap.xml
   ```

2. **更新 `index.html` 中的 canonical 和 OG**

   - `<link rel="canonical" href="https://your-domain.com/">`
   - `<meta property="og:url" content="https://your-domain.com/">`

3. **替换 OG 图片**

   将 `assets/avatar.svg` 替换为真实的个人照片或设计图，并同步更新 `index.html` 中的 `<meta property="og:image">`。

---

## 技术栈

- HTML5 语义化
- CSS3（CSS Variables、Grid、Flexbox、响应式）
- 原生 JavaScript（ES2020，无第三方依赖）
- Node 内置 `node --test` 测试

---

## License

MIT
