import { readFileSync as R, writeFileSync as W } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const I = join(HERE, "index.html");
const S = join(HERE, "script.js");
const C = join(HERE, "style.css");

let h = R(I, "utf8");
const OLD_A =
  `            <a class="retro-mail-card" href="mailto:wuhongliang55@163.com"><span class="retro-mail-card-title">EMAIL ME</span><span class="retro-mail-card-address">wuhongliang55@163.com</span></a>`;
const NEW_A =
  `            <button class="retro-mail-card retro-mail-copy" type="button" data-copy="wuhongliang55@163.com" data-copy-msg="邮箱地址已复制"><span class="retro-mail-card-title">EMAIL ME</span><span class="retro-mail-card-address">wuhongliang55@163.com</span><span class="retro-mail-card-hint">点击复制邮箱地址</span></button>`;

const cA = h.split(OLD_A).length - 1;
if (cA !== 1) { console.error("FATAL index count=" + cA); process.exit(1); }
h = h.split(OLD_A).join(NEW_A);
W(I, h + "");
console.error("style.css? index.html: -> 邮箱卡=可点复制按钮 + 第三行提示 OK");

let j = R(S, "utf8");
const OLD_J = `copyText(btn.getAttribute("data-copy"), "微信号已复制：18901962352");`;
const NEW_J = `copyText(btn.getAttribute("data-copy"), btn.getAttribute("data-copy-msg") || "微信号已复制：18901962352");`;
const cJ = j.split(OLD_J).length - 1;
if (cJ !== 1) { console.error("FATAL script count=" + cJ); process.exit(1); }
j = j.split(OLD_J).join(NEW_J);
W(S, j + "");
console.error("script.js: copyText toast 文案支持 data-copy-msg(缺省回微信号文案) OK");

let c = R(C, "utf8");
const HINT = `\n.retro-mail-card{position:relative;}\n.retro-mail-card-hint{display:block;margin-top:.55em;padding:.5em .6em;background:#000;color:#fff;font-size:.62em;font-weight:800;letter-spacing:.08em;text-transform:uppercase;text-align:center;border-radius:0;}\n.retro-mail-copy{border:none;background:none;padding:0;width:100%;text-align:left;cursor:pointer;box-sizing:border-box;}\n`;
if (!c.includes(".retro-mail-card-hint")) { c = c + HINT; W(C, c + ""); console.error("style.css: 第三行提示样式 OK"); }
else console.error("style.css: 已存在,跳过");
