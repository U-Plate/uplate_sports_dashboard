---
name: UPlate Sports Dashboard
description: A coach's console for monitoring athlete nutrition, weight, and goal progress.
colors:
  surface: "oklch(0.987 0.004 250)"
  surface-sunken: "oklch(0.964 0.006 250)"
  surface-raised: "oklch(0.995 0.002 250)"
  ink: "oklch(0.22 0.01 250)"
  ink-2: "oklch(0.4 0.01 250)"
  ink-3: "oklch(0.58 0.012 250)"
  ink-disabled: "oklch(0.72 0.008 250)"
  ink-inverse: "oklch(0.98 0.004 250)"
  hairline: "oklch(0.9 0.012 250)"
  hairline-strong: "oklch(0.82 0.018 250)"
  accent-dusty-blue: "oklch(0.5 0.10 250)"
  accent-dusty-blue-hover: "oklch(0.44 0.105 250)"
  accent-dusty-blue-pressed: "oklch(0.38 0.10 250)"
  accent-dusty-blue-tint: "oklch(0.94 0.034 250)"
  status-on-track: "oklch(0.55 0.13 145)"
  status-on-track-tint: "oklch(0.94 0.045 145)"
  status-attention: "oklch(0.55 0.14 65)"
  status-attention-tint: "oklch(0.94 0.035 65)"
  status-off-track: "oklch(0.52 0.13 35)"
  status-off-track-tint: "oklch(0.94 0.04 35)"
  status-not-logging: "oklch(0.6 0.01 250)"
  status-not-logging-tint: "oklch(0.92 0.006 250)"
  macro-calories: "oklch(0.60 0.19 21)"
  macro-protein: "oklch(0.62 0.12 240)"
  macro-protein-tint: "oklch(0.94 0.03 240)"
  macro-carbs: "oklch(0.64 0.14 160)"
  macro-carbs-tint: "oklch(0.94 0.035 160)"
  macro-fat: "oklch(0.70 0.15 68)"
  macro-fat-tint: "oklch(0.94 0.035 68)"
typography:
  display:
    fontFamily: "Fraunces, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(2rem, 1.4rem + 2.4vw, 2.625rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.018em"
  headline:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.014em"
  title:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.011em"
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "0.14em"
rounded:
  xs: "4px"
  sm: "6px"
  md: "10px"
  lg: "14px"
  xl: "20px"
  pill: "999px"
spacing:
  "0": "2px"
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "7": "32px"
  "8": "40px"
  "9": "56px"
  "10": "80px"
components:
  button-primary:
    backgroundColor: "{colors.accent-dusty-blue}"
    textColor: "{colors.ink-inverse}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "{colors.accent-dusty-blue-hover}"
    textColor: "{colors.ink-inverse}"
    rounded: "{rounded.md}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  status-badge-on-track:
    backgroundColor: "{colors.status-on-track-tint}"
    textColor: "{colors.status-on-track}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "3px 10px"
  status-badge-attention:
    backgroundColor: "{colors.status-attention-tint}"
    textColor: "{colors.status-attention}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "3px 10px"
  status-badge-off-track:
    backgroundColor: "{colors.status-off-track-tint}"
    textColor: "{colors.status-off-track}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "3px 10px"
  input-default:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "9px 12px"
---

# Design System: UPlate Sports Dashboard

## 1. Overview

**Creative North Star: "The Coach's Clipboard"**

Not a fitness-tracking app, not a business analytics console — this reads like the clipboard a good coach already carries: quick to scan, unglamorous, built to answer "who needs me today" in one look. The visual system inherits its foundation directly from the sibling UPlate Restaurant Dashboard (same cool-neutral surfaces, the same dusty UPlate blue, the same Fraunces + Inter type pairing, the same restrained spacing and motion), so the two products read as members of the same family. What's new here is layered on top: a small, deliberate vocabulary of status colors (on-track, needs attention, off-track, not logging) built for fast roster triage, and a set of macro/weight components adapted from what already works in the UPlate athlete app's Apple-Fitness-style rings.

This system explicitly rejects the generic SaaS dashboard (gradient hero tiles, Inter-everywhere card grids), the overstimulated fintech look (neon, glass, animated gradients), and — specific to this domain — the diet-culture fitness-app aesthetic: no shame streaks, no aggressive red "you failed" banners, no gamified guilt. A flag on this dashboard means "look here," never "this athlete failed."

**Key Characteristics:**
- Cool-neutral light surface, one restrained accent (dusty blue), status color used deliberately and only where it triages athletes.
- Fraunces carries the one moment of editorial voice (the sidebar wordmark, page-level verdict lines); everything else is quiet Inter.
- Status is always label + color, never color alone — this isn't a stylistic nicety here, it's the line between "coach info" and "diagnosis."
- Numbers stay honest: the weight-projection date is always phrased as an estimate, never a promise.

## 2. Colors

Cool-neutral light foundation identical to the sibling dashboard, with a new status vocabulary and a four-color macro palette layered on top for this product's domain.

### Primary
- **Dusty UPlate Blue** (`oklch(0.5 0.10 250)`): the one accent. Primary buttons, links, active nav state, and focus rings. No longer used for the calorie ring, which now carries its own Coral Red in the macro palette below.

### Secondary — Status vocabulary (roster triage)
- **On-Track Green** (`oklch(0.55 0.13 145)`): athlete is meeting nutrition goals and logging consistently.
- **Needs-Attention Amber** (`oklch(0.55 0.14 65)`): athlete is drifting from goal adherence — a nudge, not an alarm.
- **Off-Track Red** (`oklch(0.52 0.13 35)`): meaningful, sustained deviation from goals — same hue family as the sibling dashboard's negative-trend red, reused deliberately for cross-product consistency.
- **Not-Logging Gray** (`oklch(0.6 0.01 250)`): no recent data, distinct from "off-track" — the athlete hasn't checked in, which is a different problem than a bad trend.

Each status carries a matching `-tint` (badge background) at `oklch(0.94 …)` lightness, mirroring the sibling dashboard's tint pattern.

### Tertiary — Macro palette (athlete detail view)
- **Calories — Coral Red** (`oklch(0.60 0.19 21)`): the outermost, boldest ring; no longer reuses the primary accent (see below).
- **Protein — Sky Blue** (`oklch(0.62 0.12 240)`).
- **Carbs — Emerald Green** (`oklch(0.64 0.14 160)`): hue nudged 15° past a pure grass green so it doesn't collide with On-Track Green (`145`) when both appear on the same athlete screen.
- **Fat — Amber Orange** (`oklch(0.70 0.15 68)`).

Ring order stays calories (outer) → protein → carbs → fat (inner), matching `RING_DEFS` in `MacroRings.tsx`.

### Neutral
- **Surface** (`oklch(0.987 0.004 250)`): page background.
- **Surface Sunken** (`oklch(0.964 0.006 250)`): table headers, sidebar rail, recessed panels.
- **Surface Raised** (`oklch(0.995 0.002 250)`): cards that should lift slightly off the page.
- **Ink / Ink-2 / Ink-3** (`oklch(0.22 0.01 250)` / `oklch(0.4 0.01 250)` / `oklch(0.58 0.012 250)`): primary text, secondary text, tertiary/meta text.
- **Hairline / Hairline-Strong** (`oklch(0.9 0.012 250)` / `oklch(0.82 0.018 250)`): dividers and borders.

### Named Rules
**The One Accent Rule.** Dusty blue is the only saturated color used for chrome, navigation, and actions. It never competes with the status or macro palettes for attention — those are data, the accent is interface.

**The Label-Plus-Color Rule.** No status, trend, or flag is ever communicated by color alone. Every colored badge carries a text label or icon. This is a hard rule, not a nicety: these colors describe a young athlete's health data.

## 3. Typography

**Display Font:** Fraunces (with Iowan Old Style, Georgia, serif fallback)
**Body Font:** Inter (with system-ui fallback)

**Character:** The same pairing as the sibling dashboard — Fraunces supplies the one moment of warmth and editorial voice (used sparingly), Inter carries everything functional. Numbers always render in Inter with tabular figures so roster columns and macro values align cleanly.

### Hierarchy
- **Display** (500 weight, `clamp(2rem, 1.4rem + 2.4vw, 2.625rem)`, 1.1 line-height): reserved for the one verdict-level line on a page — e.g., an athlete's weight-goal ETA statement.
- **Headline** (600 weight, 22px, 1.25 line-height): page section titles ("Roster", "This Week").
- **Title** (600 weight, 17px, 1.35 line-height): card and panel titles.
- **Body** (400 weight, 14px, 1.5 line-height, max 68ch measure): all reading copy, table cells, descriptions.
- **Label** (600 weight, 11px, 1.35 line-height, 0.14em tracking, uppercase): eyebrows, table headers, status badges.

### Named Rules
**The Editorial Restraint Rule.** Fraunces appears in at most two places per screen: a masthead wordmark and one verdict-level line. Everywhere else is Inter. If Fraunces starts showing up in table cells or buttons, pull it back.

## 4. Elevation

Flat by default, identical to the sibling dashboard's philosophy. Depth comes from tonal layering (surface → surface-sunken → surface-raised), not shadow. Shadows are reserved for genuinely floating elements: popovers, modals, and the sticky action bar.

### Shadow Vocabulary
- **Soft** (`0 1px 2px oklch(0.22 0.01 250 / 0.04)`): subtle lift on raised cards at rest.
- **Pop** (`0 12px 32px oklch(0.22 0.01 250 / 0.08), 0 2px 6px oklch(0.22 0.01 250 / 0.06)`): modals, popovers.
- **Drawer** (`16px 0 48px oklch(0.22 0.01 250 / 0.12)`): mobile navigation drawer.

### Named Rules
**The Flat-by-Default Rule.** Surfaces are flat at rest. Shadow appears only as a response to state (a modal opening, a sticky bar appearing), never as decoration on static content.

## 5. Components

### Buttons
- **Shape:** rounded corners (10px, `--rounded.md`).
- **Primary:** dusty blue background, inverse text, 10px/16px padding. Used for the one primary action per screen (create team, generate invite link).
- **Ghost:** transparent background, `ink-2` text, used for secondary actions (cancel, back).
- **Hover / Focus:** background darkens one step on hover (`accent-dusty-blue-hover`); focus-visible only (never on mouse click) shows a 2px accent outline offset 2px.

### Status Badges (signature component)
Pill-shaped, label-plus-color, used on every roster row and athlete header.
- **Shape:** full pill radius (999px), 3px/10px padding, uppercase 11px label text.
- **On-track:** green text on green-tint background.
- **Needs attention:** amber text on amber-tint background.
- **Off-track:** red text on red-tint background.
- **Not logging:** gray text on gray-tint background, distinct from off-track so a coach never confuses "hasn't checked in" with "bad trend."
- Always paired with a short plain-language phrase ("On track", "Hasn't logged in 3 days"), never the badge alone.

### Roster Table (signature component)
The main landing surface. One row per athlete: status badge, name, today's goal-adherence snapshot, a small weight-trend sparkline. Sorted so athletes needing attention surface first — the badge column drives triage, not alphabetical order. Row hover lifts to `surface-sunken`; row click opens the athlete detail view. Collapses to a stacked card layout below 640px, same responsive pattern as the sibling dashboard's campaign table.

### Macro Rings (signature component)
Adapted from the UPlate athlete app's existing Apple-Fitness-style rings, so an athlete's own view and the coach's view of the same day feel like the same data, not a reinterpretation. Four concentric rings (calories outermost, then protein/carbs/fat), each in its macro color at full saturation for the "consumed" arc and a faint tint track underneath for the remaining goal.

### Weight & Goal-ETA Card
- **Shape:** raised card (14px radius, `surface-raised` background, 1px hairline border).
- **Content:** a weight-trend line chart with the goal-weight target marked as a dashed reference line, and a single Display-weight sentence above the chart stating the projected date in plain language ("Projected to reach 165 lb around March 12, based on the last 2 weeks").
- **Honesty rule:** if there isn't enough logged history yet, the card shows a plain caption explaining that instead of guessing — never a fabricated projection.

### Cards / Containers
- **Corner style:** 14px radius (`--rounded.lg`).
- **Background:** `surface-raised` on `surface` page background, or `surface-sunken` for recessed groupings (table headers, filter bars).
- **Border:** 1px hairline, no shadow at rest.
- **Internal padding:** 16–24px depending on density.

### Inputs / Fields
- **Style:** transparent background, 1px hairline border, 10px radius, 9px/12px padding.
- **Focus:** border shifts to accent blue with a soft 3px accent-tinted glow.
- **Error:** border and helper text shift to off-track red.

### Navigation
Same sidebar-rail pattern as the sibling dashboard: fixed-width rail on desktop, collapsing to a mobile top bar + bottom tab bar. Nav items are quiet `ink-2` at rest, lift to `surface` + `ink` on hover, and take an `accent-tint` background with accent-colored icon when active. The one Fraunces moment in the chrome is the sidebar wordmark.

## 6. Do's and Don'ts

### Do:
- **Do** lead every roster screen with the status badge column — the flag is the headline (PRODUCT.md Design Principle 1).
- **Do** pair every status color with a text label or icon (`The Label-Plus-Color Rule`).
- **Do** phrase the weight-goal ETA as an estimate ("around March 12, based on your recent trend"), never a guarantee.
- **Do** keep Fraunces to the masthead wordmark and one verdict line per screen (`The Editorial Restraint Rule`).
- **Do** use plain language for goal status ("hasn't logged in 3 days") over clinical or percentage-only labels.

### Don't:
- **Don't** build a generic SaaS dashboard: no gradient hero-metric tiles, no identical icon+heading+text card grids, no "Welcome back, Coach!" hero.
- **Don't** reach for crypto/fintech overstimulation: no animated gradients, neon glows, or glassmorphism cards.
- **Don't** use diet-culture or gamified fitness-app patterns: no shame streaks, no "you failed your goal" banners, no guilt-tripping copy. This is the anti-reference most specific to this product and the easiest to slip into by accident.
- **Don't** let any screen read like a surveillance log of an athlete's every bite — frame everything as support, never as catching someone.
- **Don't** communicate status, trend, or flags through color alone.
- **Don't** use `border-left`/`border-right` accent stripes, gradient text, or decorative glassmorphism anywhere in the chrome.
