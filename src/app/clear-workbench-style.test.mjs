import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const css = await readFile(new URL("./globals.css", import.meta.url), "utf8");
const primaryButtonSource = await readFile(new URL("../components/primary-button.tsx", import.meta.url), "utf8");
const formFieldSource = await readFile(new URL("../components/form-field.tsx", import.meta.url), "utf8");
const appShellSource = await readFile(new URL("../components/app-shell.tsx", import.meta.url), "utf8");

test("globals define the clear workbench surface and hero style contract", () => {
  assert.match(css, /--background:\s*#edf8f7;/);
  assert.match(css, /--background-deep:\s*#d8ecea;/);
  assert.match(css, /--surface-muted:\s*#eef8f7;/);
  assert.match(css, /--primary-deep:\s*#0b5f66;/);
  assert.match(css, /--border-soft:\s*#d4e4e7;/);
  assert.match(css, /--shadow-card:\s*0 18px 44px rgba\(15,\s*48,\s*60,\s*0\.08\);/);

  assert.match(css, /\.app-surface\s*\{/);
  assert.match(css, /\.home-hero\s*\{/);
  assert.match(css, /\.logs-hero\s*\{/);
  assert.match(css, /\.reviews-hero\s*\{/);

  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /\.home-hero-glow,\s*\.home-hero-orbit,\s*\.home-hero-dot,/);
  assert.match(css, /\.mobile-brand-marquee/);
  assert.match(css, /animation:\s*none;/);
});

test("shared controls use the clear workbench style contract", () => {
  assert.match(primaryButtonSource, /focus-visible:outline/);
  assert.match(primaryButtonSource, /cursor-pointer/);

  assert.match(formFieldSource, /app-input/);
  assert.match(formFieldSource, /text-\[var\(--foreground-soft\)\]/);
  assert.match(formFieldSource, /text-\[13px\].*leading-6.*text-\[var\(--foreground-soft\)\]/s);

  assert.match(appShellSource, /max-w-6xl/);
  assert.match(appShellSource, /bg-\[var\(--background\)\]/);
});
