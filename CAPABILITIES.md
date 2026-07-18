# UPlate Sports Dashboard — Capabilities & Purpose

## Purpose

A web dashboard that lets a coach monitor the nutritional health of their athletes — what they're eating, how close they are to their nutrition goals (today and historically), their weight trend relative to calories burned, their goal weight, and when they're projected to reach it. It is scoped strictly to food, nutrition, and weight — not hydration, sleep, training load, or any other health dimension.

This is a **new product**. It does not replace or modify the existing UPlate consumer app — it adds a coach-facing layer on top of it.

## Relationship to the existing UPlate product

UPlate (product/package name "BoilerFuel") is today a single-user Flutter app for college students: they log meals from dining-hall/retail menus or custom entries, track macros against auto-calculated goals, log their weight, and see a short-term weight-trend projection. None of that is going away. Athletes keep using the existing UPlate mobile app exactly as they do now — logging every meal and weigh-in themselves.

This dashboard is a **new web application** (built on the existing `uplate_sports_dashboard` scaffold) that reuses UPlate's backend and athlete accounts, reading the same nutrition/weight data athletes already produce and adding entirely new concepts — coaches, teams, rosters — that don't exist anywhere in UPlate today.

## Roles

**Coach**
- Signs up on their own; no school/athletic-department admin layer sits above coaches in this version.
- Can create and manage multiple teams (e.g., varsity and JV, or multiple sports).
- Can share management of a team with other coaches (assistant/co-coach access).
- Generates a shareable invite link per team to build the roster.

**Athlete**
- An UPlate app user. Tapping a coach's invite link creates their UPlate account if they don't have one yet, then attaches them to that coach's team.
- Can belong to more than one team at a time (e.g., a multi-sport athlete on two coaches' rosters simultaneously).
- Keeps logging all food and weight themselves in the UPlate app — the dashboard never logs data on their behalf.
- Can override their own auto-calculated nutrition and weight goals; the coach views these goals but does not set them.

## Team & roster management

- A coach creates a team and gets an invite link to share with athletes.
- Accepting the invite adds the athlete to the roster and **automatically grants the coach full visibility** into that athlete's nutrition and weight data — there is no separate data-sharing consent step.
- Team creation has no sport/context field that drives default goals — nutrition goals are always individual, calculated per-athlete regardless of which team(s) they're on.
- No roster lifecycle management in this version: no archiving athletes, no season rollover. Rosters are simply built up over time.

## Roster overview (main dashboard view)

The coach's landing view for a team: a list/grid of every athlete on the roster with an at-a-glance status.

- Visual status indicators (e.g., color-coded flags) surface athletes who are off-track on their nutrition goals or haven't been logging, so the coach doesn't have to open every athlete individually to spot a problem.
- These flags are visible only when the coach opens the dashboard — there are no push or email alerts sent proactively.

## Individual athlete detail view

Opening an athlete from the roster shows:

- **Full meal-by-meal detail** — the same level of granularity the athlete sees in their own app: what they ate, when, and the macro/calorie breakdown of each item. This is not a summarized/aggregate-only view.
- **Goal progress** across three timeframes:
  - Today — current calories/macros consumed vs. target.
  - Weekly trend — rolling adherence over the past week.
  - Season/custom range — a date-range picker for longer historical review.
- **Weight trend and projection** — building on UPlate's existing calories-consumed-vs-burned weight trend logic, extended with two things UPlate doesn't have today:
  - An explicit **goal weight** target.
  - A **projected date** to reach that goal weight, derived from the athlete's current calorie/weight trend.
- **Calorie-burn data** feeding the weight trend comes from whichever source the athlete already has connected in UPlate — a wearable/health-platform integration (Apple Health, Google Fit, etc.) or the manual activity-level selector — both already supported by the existing app.

## Explicitly out of scope for this version

- **No coach-to-athlete messaging or notes.** This is a view-only dashboard; any conversation between coach and athlete happens outside the product.
- **No hydration, sleep, or supplement tracking.** Scope is strictly food, nutrition, and weight.
- **No school/athletic-department admin layer.** Coaches self-serve.
- **No mobile app for coaches.** Web only.
- **No roster archiving or season rollover.**

## Platform

- **Coach side:** a web application (the `uplate_sports_dashboard` React/TypeScript/Vite project already scaffolded).
- **Athlete side:** unchanged — the existing Flutter UPlate mobile app.
- **Backend:** reuses the existing UPlate Cloudflare Workers/D1 backend and athlete accounts; this backend will need new coach/team/roster primitives, since none currently exist.
