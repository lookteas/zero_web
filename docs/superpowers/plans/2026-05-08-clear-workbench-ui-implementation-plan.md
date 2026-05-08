# Clear Workbench UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the core Zero pages into a clearer cyan-green workbench style without changing product flows or expanding scope beyond the main front-end surfaces.

**Architecture:** Keep the current Next.js page structure and local component composition. Apply the redesign through incremental updates to shared tokens in `src/app/globals.css`, shared controls in `src/components`, and small page-local visual adjustments in the home, today, logs, reviews, and login routes. Protect the work with source-level tests that assert the new surface language and shared focus/interaction conventions.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript/TSX, Tailwind 4 utility classes, Node test runner, ESLint

---

## File Structure

### Shared styling and shell

- Modify: `src/app/globals.css`
  - Own the clear-workbench tokens, hero tuning, shared surface depth, and reduced-motion adjustments.
- Modify: `src/components/primary-button.tsx`
  - Own shared button hover/focus/secondary styling consistency.
- Modify: `src/components/form-field.tsx`
  - Own input and textarea focus comfort, label spacing, and hint readability.
- Modify: `src/components/section-card.tsx`
  - Own the default framed workbench card shell used by multiple pages.
- Modify: `src/components/app-shell.tsx`
  - Own shell spacing and top-level surface consistency if needed.

### Page routes

- Modify: `src/app/page.tsx`
  - Own the home hero/data-card relationship and CTA panel polish.
- Modify: `src/app/today/page.tsx`
  - Own today topic card, writing panel, and submitted/editable state polish.
- Modify: `src/app/logs/page.tsx`
  - Own logs hero alignment, capture-panel clarity, and recent-record scanability.
- Modify: `src/app/reviews/page.tsx`
  - Own review context-vs-writing separation and restrained recovery styling.
- Modify: `src/app/login/page.tsx`
  - Own small consistency alignment with the shared workbench surface.

### Tests

- Create: `src/app/clear-workbench-style.test.mjs`
  - Assert the shared token and motion/focus conventions from `globals.css`.
- Modify: `src/app/home-focus.test.mjs`
  - Assert the clearer home dashboard relationship and CTA framing.
- Modify: `src/app/today/today-page.test.mjs`
  - Assert today page retains the workbench structure while picking up clearer shells.
- Modify: `src/app/logs/logs-page.test.mjs`
  - Assert logs keeps the cyan-leaning hero and clearer section shells.
- Modify: `src/app/reviews/reviews-page.test.mjs`
  - Assert reviews keeps warm recovery accents but lighter writing surfaces.
- Modify: `src/app/login/auth-hero.test.mjs`
  - Assert login retains hero/form composition with updated shared surface treatment.

### Docs

- Modify: `../../docs/next-session.md`
  - Record what changed, verification run, and the next handoff state after implementation.

## Task 1: Lock The Shared Clear-Workbench Style Contract

**Files:**
- Create: `src/app/clear-workbench-style.test.mjs`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Write the failing test**

```javascript
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const globalsPath = path.join(process.cwd(), "src/app/globals.css");
const globalsSource = fs.readFileSync(globalsPath, "utf8");

test("clear workbench globals define cooler surfaces and reduced-motion handling", () => {
  assert.match(globalsSource, /--background:\s*#[0-9a-fA-F]{6};/);
  assert.match(globalsSource, /--surface:\s*rgba\(/);
  assert.match(globalsSource, /--shadow-card:/);
  assert.match(globalsSource, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(globalsSource, /\.app-surface/);
  assert.match(globalsSource, /\.home-hero/);
  assert.match(globalsSource, /\.logs-hero/);
  assert.match(globalsSource, /\.reviews-hero/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/app/clear-workbench-style.test.mjs`

Expected: FAIL because `globals.css` does not yet include the reduced-motion block or the final clear-workbench token contract.

- [ ] **Step 3: Write minimal implementation**

Update `src/app/globals.css` to:

```css
:root {
  --background: #f4fbfb;
  --background-deep: #e8f4f2;
  --surface: rgba(255, 255, 255, 0.94);
  --surface-strong: rgba(255, 255, 255, 0.98);
  --surface-muted: #eef8f6;
  --foreground: #16313a;
  --foreground-soft: #58717a;
  --border-soft: #d6e6e4;
  --border-strong: #c4dbd8;
  --primary: #136f63;
  --primary-deep: #0f6159;
  --shadow-card: 0 16px 38px rgba(15, 23, 42, 0.055);
  --shadow-soft: 0 8px 22px rgba(17, 98, 105, 0.06);
}

.app-surface {
  background: var(--surface);
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(10px);
}

@media (prefers-reduced-motion: reduce) {
  .home-hero-glow,
  .home-hero-orbit,
  .home-hero-dot,
  .logs-hero-glow,
  .logs-hero-orbit,
  .logs-hero-dot,
  .reviews-hero-glow,
  .reviews-hero-orbit,
  .reviews-hero-dot {
    animation: none !important;
  }
}
```

Keep the existing hero class names, but tune their gradients/shadows toward a cleaner cyan-green background instead of replacing the page structure.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test src/app/clear-workbench-style.test.mjs`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/clear-workbench-style.test.mjs src/app/globals.css
git commit -m "feat: add clear workbench global style contract"
```

## Task 2: Tighten Shared Controls And Shell Surfaces

**Files:**
- Modify: `src/components/primary-button.tsx`
- Modify: `src/components/form-field.tsx`
- Modify: `src/components/section-card.tsx`
- Modify: `src/components/app-shell.tsx`
- Test: `src/app/clear-workbench-style.test.mjs`

- [ ] **Step 1: Write the failing test**

Extend `src/app/clear-workbench-style.test.mjs` with:

```javascript
const buttonPath = path.join(process.cwd(), "src/components/primary-button.tsx");
const fieldPath = path.join(process.cwd(), "src/components/form-field.tsx");
const shellPath = path.join(process.cwd(), "src/components/app-shell.tsx");
const buttonSource = fs.readFileSync(buttonPath, "utf8");
const fieldSource = fs.readFileSync(fieldPath, "utf8");
const shellSource = fs.readFileSync(shellPath, "utf8");

test("shared controls expose visible focus and clear workbench surfaces", () => {
  assert.match(buttonSource, /focus-visible:outline/);
  assert.match(buttonSource, /cursor-pointer/);
  assert.match(fieldSource, /app-input/);
  assert.match(fieldSource, /text-\[var\(--foreground-soft\)\]/);
  assert.match(shellSource, /max-w-6xl/);
  assert.match(shellSource, /bg-\[var\(--background\)\]/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/app/clear-workbench-style.test.mjs`

Expected: FAIL because at least one shared control does not yet expose the final focus/interaction classes or shell contract.

- [ ] **Step 3: Write minimal implementation**

Adjust the shared components with local patches like:

```tsx
// src/components/primary-button.tsx
className={[
  "inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-[18px] px-5 text-sm font-medium transition",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--primary)]",
].join(" ")}
```

```tsx
// src/components/form-field.tsx
<p className="mt-2 text-[13px] leading-6 text-[var(--foreground-soft)]">{hint}</p>
```

```tsx
// src/components/section-card.tsx
className="rounded-[26px] border border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97)_0%,rgba(244,250,248,0.95)_100%)] shadow-[0_14px_32px_rgba(15,23,42,0.05)]"
```

```tsx
// src/components/app-shell.tsx
<main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-[14px] pb-24 pt-3 md:px-6 md:pb-10 md:pt-6">
```

Use only the existing component boundaries. Do not create a new design-system layer.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test src/app/clear-workbench-style.test.mjs`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/primary-button.tsx src/components/form-field.tsx src/components/section-card.tsx src/components/app-shell.tsx src/app/clear-workbench-style.test.mjs
git commit -m "feat: polish clear workbench shared controls"
```

## Task 3: Reframe Home And Login Into The Clear Workbench

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/login/page.tsx`
- Modify: `src/app/home-focus.test.mjs`
- Modify: `src/app/login/auth-hero.test.mjs`

- [ ] **Step 1: Write the failing tests**

Update `src/app/home-focus.test.mjs` with assertions like:

```javascript
assert.match(source, /home-hero app-surface/);
assert.match(source, /grid grid-cols-2 gap-2 md:max-w-lg md:gap-3/);
assert.match(source, /rounded-\[24px\] border border-\[rgba\(210,221,215,0\.86\)\] bg-white\/92/);
```

Update `src/app/login/auth-hero.test.mjs` with assertions like:

```javascript
assert.match(source, /rounded-\[34px\] border border-\[var\(--border-soft\)\]\/90 bg-white\/85/);
assert.match(source, /rounded-\[30px\] border border-white\/80 bg-\[rgba\(255,255,255,0\.94\)\]/);
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
node --test src/app/home-focus.test.mjs
node --test src/app/login/auth-hero.test.mjs
```

Expected: At least one FAIL because the exact clearer dashboard/form shell classes are not all present yet.

- [ ] **Step 3: Write minimal implementation**

Patch `src/app/page.tsx` so the home page:

```tsx
<section className="home-hero app-surface relative overflow-hidden px-5 py-6 md:px-7 md:py-7">
```

and keeps the first content block visually tighter by using a consistent inner card shell:

```tsx
<div className="mt-4 rounded-[24px] border border-[rgba(210,221,215,0.86)] bg-white/92 p-4 shadow-[0_12px_28px_rgba(15,23,42,0.04)] md:p-5">
```

Patch `src/app/login/page.tsx` so the login page keeps the current hero/form composition but aligns to the shared workbench surface and softer depth:

```tsx
<section className="overflow-hidden rounded-[34px] border border-[var(--border-soft)]/90 bg-white/85 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
```

Do not change copy or auth actions.

- [ ] **Step 4: Run tests to verify they pass**

Run:

```bash
node --test src/app/home-focus.test.mjs
node --test src/app/login/auth-hero.test.mjs
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/app/login/page.tsx src/app/home-focus.test.mjs src/app/login/auth-hero.test.mjs
git commit -m "feat: align home and login with clear workbench style"
```

## Task 4: Polish Today And Logs Writing Workflows

**Files:**
- Modify: `src/app/today/page.tsx`
- Modify: `src/app/logs/page.tsx`
- Modify: `src/app/today/today-page.test.mjs`
- Modify: `src/app/logs/logs-page.test.mjs`

- [ ] **Step 1: Write the failing tests**

Update `src/app/today/today-page.test.mjs` with assertions like:

```javascript
assert.match(source, /rounded-\[28px\] border border-\[rgba\(204,219,212,0\.92\)\] bg-\[linear-gradient/);
assert.match(source, /rounded-\[24px\] border border-\[rgba\(210,221,215,0\.86\)\] bg-\[linear-gradient/);
assert.match(source, /PrimaryButton type="submit"/);
```

Update `src/app/logs/logs-page.test.mjs` with assertions like:

```javascript
assert.match(source, /LogsMoodHero/);
assert.match(source, /ShareLikeShell badge=\{COPY\.formBadge\}/);
assert.match(source, /rounded-\[24px\] border border-\[rgba\(210,221,215,0\.86\)\] bg-\[linear-gradient/);
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
node --test src/app/today/today-page.test.mjs
node --test src/app/logs/logs-page.test.mjs
```

Expected: FAIL because the test contract will describe the final clearer shells and section hierarchy more precisely than the current files.

- [ ] **Step 3: Write minimal implementation**

Patch `src/app/today/page.tsx` so:

- topic, form, and submitted panels use the same shell family
- field modules keep distinction through lighter accent bands instead of stronger color blocks
- action buttons remain reachable in the current layout

Representative target markup:

```tsx
<section className="overflow-hidden rounded-[28px] border border-[rgba(204,219,212,0.92)] bg-[linear-gradient(180deg,rgba(247,251,250,0.96)_0%,rgba(255,255,255,0.98)_48%,rgba(242,248,246,0.96)_100%)] shadow-[0_18px_46px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.94)]">
```

Patch `src/app/logs/page.tsx` so:

- the hero keeps the cyan leaning tone but uses the same clarity level as today/home
- input and history shells use the same calmer card depth
- recent log cards feel easier to scan

Representative target markup:

```tsx
<section className="rounded-[24px] border border-[rgba(210,221,215,0.86)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(246,250,248,0.94)_100%)] p-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)] md:p-5">
```

Do not alter the create/save/submit flows.

- [ ] **Step 4: Run tests to verify they pass**

Run:

```bash
node --test src/app/today/today-page.test.mjs
node --test src/app/logs/logs-page.test.mjs
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/today/page.tsx src/app/logs/page.tsx src/app/today/today-page.test.mjs src/app/logs/logs-page.test.mjs
git commit -m "feat: polish today and logs workbench surfaces"
```

## Task 5: Polish Reviews And Final Verification

**Files:**
- Modify: `src/app/reviews/page.tsx`
- Modify: `src/app/reviews/reviews-page.test.mjs`
- Modify: `../../docs/next-session.md`

- [ ] **Step 1: Write the failing test**

Update `src/app/reviews/reviews-page.test.mjs` with assertions like:

```javascript
assert.match(source, /ReviewsMoodHero/);
assert.match(source, /待处理复盘/);
assert.match(source, /rounded-\[24px\] border border-white\/80 bg-white\/92/);
assert.match(source, /border-\[rgba\(240,205,154,0\.8\)\] bg-\[rgba\(255,248,238,0\.86\)\]/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/app/reviews/reviews-page.test.mjs`

Expected: FAIL because the final lighter writing-surface contract and restrained recovery styling are not fully locked in yet.

- [ ] **Step 3: Write minimal implementation**

Patch `src/app/reviews/page.tsx` so:

- task context cards and writing cards separate more clearly
- recovery groups keep amber identity but lighter backgrounds
- history link and pending notices stay where they are

Representative target markup:

```tsx
<section className="rounded-[24px] border border-white/80 bg-white/92 px-4 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.04)] md:px-5 md:py-5">
```

and for recovery summary:

```tsx
<section className="rounded-[20px] border border-[rgba(240,205,154,0.8)] bg-[rgba(255,248,238,0.86)] px-4 py-3 text-[13px] leading-6 text-[var(--foreground-soft)]">
```

Then update `../../docs/next-session.md` with:

- the completed clear-workbench polish
- touched files
- verification commands and results
- the next single handoff item, if any remains

- [ ] **Step 4: Run tests and app verification**

Run:

```bash
node --test src/app/reviews/reviews-page.test.mjs
node --test src/app/clear-workbench-style.test.mjs
node --test src/app/home-focus.test.mjs
node --test src/app/today/today-page.test.mjs
node --test src/app/logs/logs-page.test.mjs
node --test src/app/login/auth-hero.test.mjs
npm run lint
npm run build
```

Expected:

- all listed node tests PASS
- `npm run lint` exits successfully
- `npm run build` completes successfully

- [ ] **Step 5: Commit**

```bash
git add src/app/reviews/page.tsx src/app/reviews/reviews-page.test.mjs ../../docs/next-session.md
git commit -m "feat: finish clear workbench ui polish"
```

## Self-Review

- Spec coverage check:
  - shared cyan-green surface direction is covered by Tasks 1-2
  - home/login consistency is covered by Task 3
  - today/logs writing workbench polish is covered by Task 4
  - reviews warmth/recovery restraint and final handoff are covered by Task 5
- Placeholder scan:
  - no unfinished placeholder markers or implicit deferred-test instructions remain
- Type consistency:
  - all referenced files and test filenames match the current codebase paths under `src/app`, `src/components`, and `../../docs`
