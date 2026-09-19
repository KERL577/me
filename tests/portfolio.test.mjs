import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(fs.readFileSync(path.join(root, "portfolio.json"), "utf8"));
const EXPECTED_IDS = ["360", "baanju", "paiouyun", "weimob", "zhongan", "freelance", "ip", "logo"];
const REQUIRED = ["id", "name", "type", "company", "description", "year", "tags", "cover", "images"];

test("portfolio.json has exactly the 8 expected categories", () => {
  assert.ok(Array.isArray(data.categories));
  assert.equal(data.categories.length, 8);
  assert.deepEqual(data.categories.map((c) => c.id), EXPECTED_IDS);
});

test("every category has all required fields, non-empty", () => {
  for (const c of data.categories) {
    for (const field of REQUIRED) {
      assert.ok(c[field] !== undefined && c[field] !== "", `category ${c.id} missing ${field}`);
    }
    assert.ok(Array.isArray(c.tags) && c.tags.length > 0, `category ${c.id} tags empty`);
    assert.ok(Array.isArray(c.images) && c.images.length > 0, `category ${c.id} images empty`);
  }
});

test("every image path exists on disk and cover is first image", () => {
  for (const c of data.categories) {
    assert.ok(fs.existsSync(path.join(root, c.cover)), `cover missing: ${c.cover}`);
    assert.equal(c.cover, c.images[0], `cover must be images[0] for ${c.id}`);
    for (const img of c.images) {
      assert.ok(fs.existsSync(path.join(root, img)), `image missing: ${img}`);
      assert.ok(img.endsWith(".webp"), `not webp: ${img}`);
    }
  }
});
