---
name: run-mobile
description: Launch and drive the Waypoint Walker App (apps/mobile) for manual or scripted verification. Use whenever asked to run, test, screenshot, or confirm a change works in the Walker App.
---

# Running apps/mobile (Walker App)

MapLibre and the camera QR scanner are native-only, but the core walker loop — Discover, Trail/Place detail, manual-entry check-in, Passport, Field Notes, Account — is fully testable via Expo's web target. This is the fastest way to verify a change without a device or simulator.

## Launch

From `apps/mobile`:

```bash
npx expo start --web --port 8090
```

Poll instead of sleeping:

```bash
until curl -sf http://localhost:8090 >/dev/null; do sleep 2; done
```

Stop with `pkill -f "expo start"` (also takes down the Metro bundler process it spawns).

Reads `apps/mobile/.env` for `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — **this points at the team's real dev Supabase project, not a local or mocked backend.** Check-ins, Field Notes, and any other write you trigger are real and persist.

## Driving it

No `chromium-cli` in this environment; use raw Playwright instead:

```bash
npm install playwright   # in a scratch dir, not the repo
```

```js
const { chromium } = require("playwright");
const browser = await chromium.launch({ args: ["--no-sandbox"] });
const context = await browser.newContext({ viewport: { width: 420, height: 900 } });
const page = await context.newPage();
```

The Chromium binary is typically already cached (e.g. under `~/AppData/Local/ms-playwright` on Windows), so the first launch shouldn't need a fresh download.

### Skip onboarding

A fresh browser context always lands on `/onboarding` (the AsyncStorage-backed first-launch gate is empty on first load). Skip it directly instead of clicking through:

```js
await page.goto(BASE, { waitUntil: "domcontentloaded" });
await page.evaluate(() =>
  localStorage.setItem("waypoint:onboarding_complete:v1", "true"),
);
```

### Sign in

Auth is required to confirm a check-in, view Passport, or save a Field Note. Anonymous users can browse Discover/Trail/Place detail and reach the check-in "ready" screen — confirming from there now shows a graceful sign-in prompt rather than failing silently.

No test account is stored in this repo. Ask the user for credentials each session, or maintain your own disposable Supabase test account — sign-up is self-service via the app's own "Create account" button. Sign-in form is at `/auth`: fields are placeholder-labelled `Email` / `Password`, submit button text is exactly `Sign in`.

### Finding valid demo data

Don't assume seed-file tokens are still live — query the database directly:

```bash
SUPA=<value of EXPO_PUBLIC_SUPABASE_URL>
KEY=<value of EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY>
curl -s "$SUPA/rest/v1/qr_codes?status=eq.active&select=id,code_value" -H "apikey: $KEY" -H "Authorization: Bearer $KEY"
curl -s "$SUPA/rest/v1/trails?status=eq.published&select=id,name,slug" -H "apikey: $KEY" -H "Authorization: Bearer $KEY"
curl -s "$SUPA/rest/v1/business_locations?status=eq.active&select=id,name" -H "apikey: $KEY" -H "Authorization: Bearer $KEY"
```

Manual check-in entry (the "Can't scan? Enter the code instead" toggle on `/check-in`) takes a `code_value` directly, e.g. `wp1-7XK4-Q2M9`.

## Gotchas

- **Don't trust one early screenshot of a loading state as "stuck."** Metro's dev server / Fast Refresh can cause a transient re-render that briefly reverts a resolved state back to its loading text, which `waitForFunction`-style polling can misread as "still loading" even though the real, settled state is fine. Hit this twice in one session before recognizing the pattern. Always re-verify with a flat, generous `waitForTimeout` (10–20s, no early-exit polling) before concluding something is genuinely hung — then confirm with `requestfailed`/`pageerror` event listeners, not just DOM text snapshots.
- **The "already visited today" guard is per-location, per-day.** Once an account has checked into a demo location during a test session, further check-ins there hit `CheckInAlreadyVisited` until the next venue-day boundary. Plan multi-step test flows around this (e.g. use a second demo location) rather than reusing the same one.
- **A `TypeError` mentioning `postgrest-js` and `this`/`cloneRequestState`** almost always means a Supabase query builder method (`.update()`, `.insert()`, etc.) was extracted as a bare function reference and called without its receiver, dropping `this` binding. Grep for `as unknown as` casts around `locals.supabase.from(...).update` — that pattern caused exactly this crash once already (`business/src/routes/+page.server.ts`).
- **`expo-haptics` is safe to call unconditionally, including on web** — confirmed by reading `ExpoHaptics.web.ts`: real vibration via `navigator.vibrate` where supported, a documented iOS Safari fallback, silent no-op otherwise. No platform gating needed before adding a haptics call.
- **Contrast-check any new color pairing before shipping it as text.** The theme's earthy palette mostly passes WCAG AA comfortably, but at least one token (`accent`, pre-2026-07-08 value `#8A6F3D`) only hit 3.75:1 against `primarySoft` — below the 4.5:1 minimum for normal-weight text under 18px.

## Current audited state

Full per-feature results (what's working, what was tested, what to preserve) live in [`docs/field-guide/WP023-Mobile-Surface-Audit.md`](../../../docs/field-guide/WP023-Mobile-Surface-Audit.md). Re-run the relevant section there instead of re-auditing from scratch.
