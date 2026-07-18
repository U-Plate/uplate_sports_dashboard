# Product

## Register

product

## Users

**Coaches** who manage one or more athletic teams and want a fast, trustworthy read on their athletes' nutritional health. They sign up on their own — no school/athletic-department admin layer sits above them — create a team, and share an invite link to build their roster. They may co-manage a team with an assistant coach, and may run more than one team (varsity/JV, multiple sports).

Coach context:

- **Checking in, not micromanaging.** Opens the dashboard between practices or from an office computer to see who needs attention, not to police every bite an athlete logs.
- **Not a dietitian.** Comfortable with "on track", "hasn't logged", "trending toward goal". Not fluent in macro/TDEE vocabulary and shouldn't need to be to read the roster at a glance.
- **Single primary question:** *"Which of my athletes need my attention today?"* The roster view should answer that before anything else.
- **Responsible for young people's wellbeing.** Weight and food data about athletes — often teenagers or young adults — carries real psychological weight. Trust here isn't about ad spend; it's about the coach believing this tool helps them support athletes, not surveil or shame them.

Athletes themselves are not users of this dashboard — they keep logging their own meals and weight in the existing UPlate mobile app. This product is coach-facing only.

## Product Purpose

A web dashboard for coaches to monitor the food, nutrition, and weight health of every athlete on their roster, reusing the athlete-facing data already produced by the UPlate app. Coaches use it to:

1. Create teams and invite athletes via a shareable link; co-manage a team with other coaches.
2. See, at a glance, which athletes on the roster are on track, need attention, or haven't been logging.
3. Drill into any athlete's full meal-by-meal log, nutrition-goal adherence (today, this week, or a custom range), and weight trend.
4. See an athlete's goal weight and the date they're projected to reach it, based on their real calorie and weight trend.

Success looks like a coach opening the dashboard, immediately seeing who needs a conversation today, and getting there in one or two clicks — not paging through every athlete's data manually.

## Brand Personality

**Clear, caring, steady.** This shares its foundation with the sibling UPlate Restaurant Dashboard's "confident operator" personality (plain-spoken, no jargon, no hype, numbers as the headline) but is reframed for a coaching relationship rather than a business-operator relationship: this dashboard exists in service of athlete wellbeing, and every screen should read that way.

Voice rules:

- Speak like a coach who knows their athletes, not a corporate wellness product. "Hasn't logged in 3 days" beats "Compliance: 0%."
- Nutrition and weight data reads as performance information, never as judgment. No diet-culture framing, no shame, no streaks-and-failure language.
- Flags are informational, not punitive. A red status means "look here," not "this athlete failed."
- Numbers are still the headline (inherited from the sibling dashboard) — but always with enough context that a number never reads as a verdict on its own.

## Anti-references

Inherited from the sibling dashboard, plus two new ones specific to monitoring young athletes' food and weight data.

1. **Generic SaaS dashboard.** Blue/grey sidebar, gradient hero-metric tiles, identical icon+heading+text card grids, Inter-everything, "Welcome back, Coach!" hero.
2. **Crypto / fintech overstimulation.** Animated gradients, neon glows, glassmorphism cards, aspirational tickers. Wrong tone for a coach checking on a kid's dinner.
3. **Diet-culture / fitness-app gamification.** Shame streaks, "you failed your goal today" messaging, aggressive red "you're behind!" banners, guilt-tripping push copy. This product deals with young athletes' relationship to food and weight; nothing here should read like a calorie-counting app selling anxiety.
4. **Surveillance panel.** Anything that reads like an audit log of every bite an athlete took. The framing throughout is "how can I support this athlete," never "catch them slipping."

The dashboard sits in the negative space between generic SaaS, overstimulating fintech, and punitive diet-tracking apps — closer in spirit to a coach's clipboard than to a calorie-counting app.

## Design Principles

1. **The flag is the headline.** Every roster screen leads with who needs attention, before anything else. If the coach has to hunt across the roster to find who's struggling, the screen is wrong.
2. **Plain words, not clinical vocabulary.** A coach shouldn't need to know what TDEE or a macro split is to understand an athlete's status. Expose the underlying numbers, but the primary read is always in plain language.
3. **Data as care, not surveillance.** Every screen should read as support for the athlete's wellbeing. Copy, empty states, and status language are always framed around helping, never catching or shaming.
4. **Quiet by default, warm at the seams.** Chrome stays restrained and trustworthy (shared with the sibling dashboard); personality lives in copy, empty states, and small interaction moments, never in gradient backgrounds or decorative motion.
5. **Honest or absent, especially about projections.** The goal-weight ETA is a directional estimate from a noisy trend, not a promise. It must always read as an estimate ("around March 12, based on your recent trend") never as a guarantee, and should visibly caveat itself when there isn't enough data yet.

## Accessibility & Inclusion

Same bar as the sibling dashboard, with one addition load-bearing for this domain:

- **WCAG 2.2 AA across every screen.** Body text contrast ≥ 4.5:1, large text ≥ 3:1, non-text UI elements ≥ 3:1, visible focus on every interactive element, full keyboard reachability.
- **`prefers-reduced-motion` respected.** No motion-only information; reduced-motion users see the same content statically.
- **Status is never color-only.** On-track / needs-attention / off-track / not-logging must each carry a label or icon in addition to color — doubly important here since these flags describe a young person's health, not a business metric.
- **Touch targets ≥ 44×44 px.**
- **Plain-language errors and empty states.** Never a raw error code; always what happened and what to do next, in the coach's words.
- **Framing sensitivity.** No visual treatment (color, iconography, copy) should imply a value judgment about an athlete's body or weight. Weight and goal-adherence data is presented neutrally and factually.
