import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const file = join(HERE, "index.html");
const cssf = join(HERE, "style.css");

let h = readFileSync(file, "utf8");

const REPL = [
  // nav 联系我
  [
    `<a class="button button-dark btn-31 nav-contact" href="#contact"><span class="text-container"><span class="text">联系我</span></span></a>`,
    `<a class="button button-dark btn-33 nav-contact" href="#contact"><span>联系我</span></a>`,
  ],
  // hero 我的作品
  [
    `<a class="button button-dark btn-31" href="#product"><span class="text-container"><span class="text">我的作品</span></span></a>`,
    `<a class="button button-dark btn-33" href="#product"><span>我的作品</span></a>`,
  ],
  // see-more 打开↗ (woze)
  [
    `<a class="see-more btn-31" href="https://woze.de5.net" target="_blank" rel="noopener noreferrer"><span class="text-container"><span class="text">打开 ↗</span></span></a>`,
    `<a class="see-more btn-33" href="https://woze.de5.net" target="_blank" rel="noopener noreferrer"><span>打开 ↗</span></a>`,
  ],
  // see-more 打开↗ (qrsk)
  [
    `<a class="see-more btn-31" href="https://qrsk.de5.net" target="_blank" rel="noopener noreferrer"><span class="text-container"><span class="text">打开 ↗</span></span></a>`,
    `<a class="see-more btn-33" href="https://qrsk.de5.net" target="_blank" rel="noopener noreferrer"><span>打开 ↗</span></a>`,
  ],
  // 复制微信
  [
    `<button class="button button-dark btn-31" type="button" data-copy="18901962352"><span class="text-container"><span class="text">复制微信</span></span></button>`,
    `<button class="button button-dark btn-33" type="button" data-copy="18901962352"><span>复制微信</span></button>`,
  ],
  // 去站酷看看 →
  [
    `<a class="button button-light btn-31" href="https://www.zcool.com.cn/u/ZMTA3MzQwMzQ0" target="_blank" rel="noopener noreferrer"><span class="text-container"><span class="text">去站酷看看 →</span></span></a>`,
    `<a class="button button-light btn-33" href="https://www.zcool.com.cn/u/ZMTA3MzQwMzQ0" target="_blank" rel="noopener noreferrer"><span>去站酷看看 →</span></a>`,
  ],
  // 邮箱
  [
    `<a class="button button-light btn-31" href="mailto:wuhongliang55@163.com"><span class="text-container"><span class="text">wuhongliang55@163.com →</span></span></a>`,
    `<a class="button button-light btn-33" href="mailto:wuhongliang55@163.com"><span>wuhongliang55@163.com →</span></a>`,
  ],
];

let changed = 0;
for (const [old, next] of REPL) {
  const count = h.split(old).length - 1;
  if (count !== 1) {
    console.error(`FATAL: expected 1 occurrence, got ${count}\n  ${old.slice(0, 60)}`);
    process.exit(1);
  }
  h = h.split(old).join(next);
  changed++;
}
writeFileSync(file, h);
console.error(`index.html: ${changed}/7 -> btn-33 OK`);

const BTN33_CSS = `
/* From Uiverse.io by Web-Potato — pressed-ledge buttons (scoped to .btn-33) */
.btn-33 {
  background-color: #212121;
  border: 0.08em solid #fff;
  border-radius: 0.3em;
  cursor: pointer;
  font-size: 12px;
  height: 4.2em;
  padding: 0.1em 0.25em;
  width: 13em;
}

.btn-33 > span {
  align-items: center;
  background-color: #212121;
  border: 0.08em solid #fff;
  border-radius: 0.2em;
  bottom: 0.4em;
  box-shadow: 0 0.4em 0.1em 0.019em #fff;
  color: #fff;
  display: flex;
  font-size: 1.5em;
  height: 2.5em;
  justify-content: center;
  position: relative;
  width: 8.25em;
}

.btn-33:hover > span {
  box-shadow: 0 0 0 0 #fff;
  transform: translate(0, 0.4em);
  transition: all 0.5s;
}

.btn-33:not(:hover) > span {
  transition: all 1s;
}

@media (prefers-reduced-motion: reduce) {
  .btn-33 > span {
    transition: none;
  }
}
`;

let c = readFileSync(cssf, "utf8");
if (!c.includes(".btn-33")) {
  c = c + BTN33_CSS;
  writeFileSync(cssf, c);
  console.error("style.css: .btn-33 appended OK");
} else {
  console.error("style.css: .btn-33 already present, skipped");
}
