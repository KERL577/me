---
name: visual-hierarchy
description: Use when designing or reviewing the visual layout of web pages — when a page feels flat, generic/templated, spatially unbalanced, typographically weak, or when building landing pages, portfolios, or marketing sites.
---

# Skill: Visual Hierarchy Expert

## Purpose

Analyze and optimize website visual hierarchy. Hierarchy is not decoration — it is **the order your eye is forced to follow**. Each screen keeps ONE focal point and every other element steps down in priority.

## Capabilities

The agent should evaluate:

### 1. Visual Focus
- What users see first (the strongest contrast wins the eye)
- Primary attention point — exactly one per section
- Focal dominance — everything else stays neutral-muted by comparison

### 2. Layout Structure
- Grid system — consistent container width (e.g. `max-width:1180px`), no drift
- Alignment — left/space-between consistent; 4/8px baseline, steps `4 8 16 24 32 48 64 96`
- Balance — group-inner spacing (8-16px) < group-gap (32-64px), section padding `clamp(64px,10vw,120px)`
- Spacing — look for "fill everything" instinct; whitespace is content, not waste

### 3. Typography Hierarchy
- Heading scale — ≥ 3 clearly contrasting steps, never 16/17/18 stairs
- Font contrast — one display weight (≥600, negative `letter-spacing`), body weight 400 for contrast
- Reading rhythm — `line-height 1.6-1.75`, `text-wrap: balance` on headings, `pretty` on body

### 4. Color Hierarchy
- Primary color — exactly one (accent), coverage ≤ 15% of the page
- Accent color — used only for links, highlight words, eyebrow labels, active-state borders, small buttons; never large fills
- Contrast — ≥ 3 neutral steps (ink / muted / border / surface), body text ≥ 4.5:1 (WCAG AA); accent soft-surface via `color-mix(in srgb, accent 8-12%, transparent)`

### 5. User Flow
- Eye movement — the hotpath: **heading → lead → CTA → supporting surface**
- CTA visibility — every section exposes one action-colored or ink-colored CTA
- Conversion path — interactive contrast (hover `translateY(-4px)` + accent border, active-state isolation) marks what is clickable

## Analysis Framework

When analyzing a website:

### Step 1: Identify the first visual impression
Close for 3 seconds, reopen — what lands first? If the answer is "nothing / everything", hierarchy failed. Note competing focal points (they cancel out).

### Step 2: Map attention flow
Trace the eye path section by section using the hierarchy levers (in power order):
1. Spacing rhythm — the fastest lever, fix gaps first
2. Type scale + weight
3. Single accent color (sparingly)
4. Edge hierarchy — white card, 1px hairline border, radius 16-22, light shadow `0 8px 24px rgba(0,0,0,.06)`
5. Emphasis devices — eyebrow label / one focus-word / active-state isolation / dark panel with bright text
6. Motion — 150-400ms, `cubic-bezier(.2,.8,.2,1)`, directional (enter = fade + translateY up), `prefers-reduced-motion` disables looping, content visible

### Step 3: Evaluate hierarchy
Score each area above. Symptom → lever:

| Symptom | Lever |
|---|---|
| Flat, empty, dull layout | Increase inter-module rhythm, scale up heading one step |
| Templated, card-after-card | Shrink accent coverage, keep one focus word per block |
| Crammed, no grouping | Halve spacings, rebuild structure with group gaps |
| Heading not big enough | Widen scale, add `-0.03~-0.05em` letter-spacing |
| "Can't tell where to look" | Demote everything to neutral except one focal point |
| Cheap motion | Cut to 1-2 animations with meaning |

### Step 4: Suggest improvements
Concretely, per area: tokens to add, spacings to replace, type scale to widen, accent to move. Reference `principles.md` (worked numbers), `checklist.md` (pass/fail gates), `examples.md` (before/after CSS).

### Step 5: Provide redesign direction
Restate the one-sentence focal narrative per screen, then the minimum change list to reach it — demote before you decorate.

## Common Mistakes

- Patching flatness with more color/shadow instead of contrast
- Emphasizing several modules at once = zero emphasis; weaken first
- Low-contrast body on dark backgrounds; huge accent-colored buttons
- Motion at 700ms+ or over-bouncing that steals the focus
- Checking hierarchy only while building, never with the 3-second reopen test