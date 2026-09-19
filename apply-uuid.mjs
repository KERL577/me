import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const HERE = dirname(fileURLToPath(import.meta.url));
const I = join(HERE, "index.html");
const C = join(HERE, "style.css");

let h = readFileSync(I, "utf8");

const OLD = `            <a class="button button-light btn-33" href="mailto:wuhongliang55@163.com"><span class="text-container"><span class="text">wuhongliang55@163.com →</span></span></a>`;

const NEW = `            <div class="uuid-brutal-box" id="uuid-box">
              <div class="box-cursor"></div>
              <div class="box-label" aria-hidden="true">EMAIL</div>
              <input class="uuid-input button-light" id="uuid-focus" type="text" inputmode="email" value="wuhongliang55@163.com" aria-label="电子邮件地址" readonly>
              <input type="text" class="input-shadow" tabindex="-1" aria-hidden="true" placeholder="wuhongliang55@163.com">
            </div>`;

const n = h.split(OLD).length - 1;
if (n !== 1) { console.error("FATAL count=" + n); process.exit(1); }
h = h.split(OLD).join(NEW);
writeFileSync(I, h);
console.error("index.html: mailbox button -> uuid-brutal-box OK");

const UUID_CSS = `\n/* From Uiverse.io by Stephen Agwu - brutal uuid box (scoped) */\n.uuid-brutal-box{max-width:16.5em;cursor:default;user-select:none;--icon:48px;--uuid-label:#000;--uuid-field:#fff;}\n.uuid-brutal-box .box-cursor{position:absolute;inset:auto 0 0;height:.4em;background:var(--accent-color);animation:uuid-cursor 1.2s steps(2) infinite;}\n.uuid-brutal-box .box-label{display:block;font-weight:800;letter-spacing:.25em;text-transform:uppercase;margin-bottom:.5em;color:var(--text-color);}\n.uuid-brutal-box .uuid-input{display:block;box-sizing:border-box;width:100%;background:var(--panel-color);border:.15em solid var(--text-color);border-radius:.3em;font-family:inherit;font-weight:700;font-size:1em;padding:.7em .9em;color:var(--text-color);}\n.uuid-brutal-box .uuid-input:read-only{border-color:var(--accent-color);}\n@keyframes uuid-cursor{50%{opacity:0;}}\n@media (prefers-reduced-motion: reduce){.uuid-brutal-box .box-cursor{animation:none;}}\n`;

let c = readFileSync(C, "utf8");
if (!c.includes(".uuid-brutal-box")) {
  c = c + UUID_CSS;
  writeFileSync(C, c);
  console.error("style.css: .uuid-brutal-box appended OK");
} else {
  console.error("style.css: .uuid-brutal-box already present, skipped");
}
