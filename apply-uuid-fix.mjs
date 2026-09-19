import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const HERE = dirname(fileURLToPath(import.meta.url));
const I = join(HERE, "index.html");
const C = join(HERE, "style.css");

let h = readFileSync(I, "utf8");

const OLD =
  '          <a class="button button-light btn-33" href="mailto:wuhongliang55@163.com"><span>wuhongliang55@163.com →</span></a>';
const NEW = OLD.replace(
  'class="button button-light btn-33"',
  'class="button button-light btn-33 uuid-brutal-link"',
);

const n = h.split(OLD).length - 1;
if (n !== 1) { console.error("FATAL count=" + n); process.exit(1); }
h = h.split(OLD).join(NEW);
writeFileSync(I, h);
console.error("index.html: mail pill -> +uuid-brutal-link OK");

const UUID_CSS = `\n/* From Uiverse.io by VirendraVishwakarma-ish — brutal UUID field, scoped */\n.uuid-brutal-link{display:inline-flex;align-items:center;gap:.4em;font-family:"JetBrains Mono",ui-monospace,monospace;background:#14141a;color:#fff;border:.15em solid var(--accent-color);border-radius:.35em;padding:.6em .9em;box-shadow:.35em .35em 0 var(--accent-color);text-transform:none;letter-spacing:.02em;transition:transform .12s ease,box-shadow .12s ease;}\n.uuid-brutal-link:hover{transform:translate(.12em,.12em);box-shadow:.18em .18em 0 var(--accent-color);}\n.uuid-brutal-link:focus-within{outline:.1em solid #fff;outline-offset:.15em;}\n@media (prefers-reduced-motion: reduce){.uuid-brutal-link{transition:none;}}\n`;

let c = readFileSync(C, "utf8");
if (!c.includes(".uuid-brutal-link")) {
  c = c + UUID_CSS;
  writeFileSync(C, c);
  console.error("style.css: .uuid-brutal-link appended OK");
} else {
  console.error("style.css: .uuid-brutal-link present, skip rename?");
}
