import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = fileURLToPath(new URL(".", import.meta.url));
const index = join(HERE, "index.html");
const css = join(HERE, "style.css");

let h = readFileSync(index, "utf8");

const REPL = [
  [
    `<a class="button button-dark cube-flip nav-contact" href="#contact"><span class="scene"><span class="cube"><span class="side top">HELLO</span><span class="side front">联系我</span></span></span></a>`,
    `<a class="button button-dark btn-31 nav-contact" href="#contact"><span class="text-container"><span class="text">联系我</span></span></a>`,
  ],
  [
    `<a class="button button-dark cube-flip" href="#product"><span class="scene"><span class="cube"><span class="side top">TOP</span><span class="side front">我的作品</span></span></span></a>`,
    `<a class="button button-dark btn-31" href="#product"><span class="text-container"><span class="text">我的作品</span></span></a>`,
  ],
  [
    `<a class="see-more cube cube-hover" href="https://woze.de5.net" target="_blank" rel="noopener noreferrer"><span class="bg-top"><span class="bg-inner"></span></span><span class="bg-right"><span class="bg-inner"></span></span><span class="bg"><span class="bg-inner"></span></span><span class="text">打开 ↗</span></a>`,
    `<a class="see-more btn-31" href="https://woze.de5.net" target="_blank" rel="noopener noreferrer"><span class="text-container"><span class="text">打开 ↗</span></span></a>`,
  ],
  [
    `<a class="see-more cube cube-hover" href="https://qrsk.de5.net" target="_blank" rel="noopener noreferrer"><span class="bg-top"><span class="bg-inner"></span></span><span class="bg-right"><span class="bg-inner"></span></span><span class="bg"><span class="bg-inner"></span></span><span class="text">打开 ↗</span></a>`,
    `<a class="see-more btn-31" href="https://qrsk.de5.net" target="_blank" rel="noopener noreferrer"><span class="text-container"><span class="text">打开 ↗</span></span></a>`,
  ],
  [
    `<button class="button button-dark cube-flip" type="button" data-copy="18901962352"><span class="scene"><span class="cube"><span class="side top">COPY</span><span class="side front">复制微信 18901962352</span></span></span></button>`,
    `<button class="button button-dark btn-31" type="button" data-copy="18901962352"><span class="text-container"><span class="text">复制微信</span></span></button>`,
  ],
  [
    `<a class="button button-light cube cube-hover" href="https://www.zcool.com.cn/u/ZMTA3MzQwMzQ0" target="_blank" rel="noopener noreferrer"><span class="bg-top"><span class="bg-inner"></span></span><span class="bg-right"><span class="bg-inner"></span></span><span class="bg"><span class="bg-inner"></span></span><span class="text">去站酷看看 →</span></a>`,
    `<a class="button button-light btn-31" href="https://www.zcool.com.cn/u/ZMTA3MzQwMzQ0" target="_blank" rel="noopener noreferrer"><span class="text-container"><span class="text">去站酷看看 →</span></span></a>`,
  ],
  [
    `<a class="button button-light cube cube-hover" href="mailto:wuhongliang55@163.com"><span class="bg-top"><span class="bg-inner"></span></span><span class="bg-right"><span class="bg-inner"></span></span><span class="bg"><span class="bg-inner"></span></span><span class="text">wuhongliang55@163.com →</span></a>`,
    `<a class="button button-light btn-31" href="mailto:wuhongliang55@163.com"><span class="text-container"><span class="text">wuhongliang55@163.com →</span></span></a>`,
  ],
];

for (const [old, next] of REPL) {
  const count = h.split(old).length - 1;
  if (count !== 1) {
    console.error(`FATAL: expected exactly 1 occurrence, got ${count}\n  old=${old.slice(0, 70)}`);
    process.exit(1);
  }
  h = h.split(old).join(next);
}

writeFileSync(index, h || "\n");
console.error("index.html: 7 buttons -> btn-31 OK");

const BTN31_CSS = `
/* From Uiverse.io by doniaskima */
.btn-31,
.btn-31 *,
.btn-31 :after,
.btn-31 :before,
.btn-31:after,
.btn-31:before {
  border: 0 solid;
  box-sizing: border-box;
}

.btn-31 {
  -webkit-tap-highlight-color: transparent;
  -webkit-appearance: button;
  background-color: #000;
  background-image: none;
  color: #fff;
  cursor: pointer;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif,
    Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  font-size: 100%;
  font-weight: 900;
  line-height: 1.5;
  margin: 0;
  -webkit-mask-image: -webkit-radial-gradient(#000, #fff);
  padding: 0;
}

.btn-31:disabled {
  cursor: default;
}

.btn-31:-moz-focusring {
  outline: auto;
}

.btn-31 svg {
  display: block;
  vertical-align: middle;
}

.btn-31 [hidden] {
  display: none;
}

.btn-31 {
  border-width: 1px;
  padding: 1rem 2rem;
  position: relative;
  text-transform: uppercase;
}

.btn-31:before {
  --progress: 100%;
  background: #fff;
  -webkit-clip-path: polygon(
    100% 0,
    var(--progress) var(--progress),
    0 100%,
    100% 100%
  );
  clip-path: polygon(
    100% 0,
    var(--progress) var(--progress),
    0 100%,
    100% 100%
  );
  content: "";
  inset: 0;
  position: absolute;
  transition: -webkit-clip-path 0.2s ease;
  transition: clip-path 0.2s ease;
  transition: clip-path 0.2s ease, -webkit-clip-path 0.2s ease;
}

.btn-31:hover:before {
  --progress: 0%;
}

.btn-31 .text-container {
  display: block;
  overflow: hidden;
  position: relative;
}

.btn-31 .text {
  display: block;
  font-weight: 900;
  mix-blend-mode: difference;
  position: relative;
}

.btn-31:hover .text {
  -webkit-animation: move-up-alternate 0.3s ease forwards;
  animation: move-up-alternate 0.3s ease forwards;
}

@-webkit-keyframes move-up-alternate {
  0% { transform: translateY(0); }
  50% { transform: translateY(80%); }
  51% { transform: translateY(-80%); }
  to { transform: translateY(0); }
}

@keyframes move-up-alternate {
  0% { transform: translateY(0); }
  50% { transform: translateY(80%); }
  51% { transform: translateY(-80%); }
  to { transform: translateY(0); }
}
`;

let c = readFileSync(css, "utf8");
if (!c.includes(".btn-31")) {
  c = c + BTN31_CSS;
  writeFileSync(css, c || "\n");
  console.error("style.css: .btn-31 CSS appended OK");
} else {
  console.error("style.css: .btn-31 already present, skipped append");
}
