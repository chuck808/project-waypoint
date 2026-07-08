# WP023 -- Mobile Surface Audit

> **Status:** Working Document -- first full pass completed 2026-07-08\
> **Scope:** `apps/mobile`\
> **Purpose:** Establish the Walker App as the implementation baseline
> for Waypoint Version 1.

## How this was audited

All ten items below were driven live -- signed in with a real account
against the team's dev Supabase project, via Expo's web target plus
Playwright (no `chromium-cli` in this environment; see
[`run-mobile`](../../.claude/skills/run-mobile/SKILL.md) for the exact
mechanics, credentials handling, and gotchas hit along the way). Native
device/simulator testing (MapLibre rendering, camera QR scan, VoiceOver/
TalkBack) was out of scope for this pass -- flagged per-item below where
it still needs a physical check. Every bug found here was fixed and
re-verified live in the same session, not just patched and assumed
correct.

## Position

The mobile app is the most important product surface for MVP.

If Waypoint does not work well in the hands of a walker, every other
surface becomes secondary.

## Audit Priority

Audit in this order:

1.  QR check-in
2.  Passport timeline
3.  Discover
4.  Places
5.  Trails
6.  Map
7.  Authentication
8.  Offline/error behaviour
9.  Visual consistency
10. Accessibility

## Audit Template

For each feature:

``` md
## Feature

### Current User Journey

### Files / Routes

### Data Dependencies

### Current Status

- Working
- Partially working
- Spike
- Not implemented

### Test Status

### Preserve

### Improve

### Risks

### MVP Recommendation
```

## QR Check-in

### Current User Journey
Scan (camera, native-only) or manual code entry -> resolve -> ready
(shows steward welcome message if set) -> confirm -> recorded (VenueStamp
animation + Field Note prompt), or already-visited / not-recognised.

### Files / Routes
`app/(tabs)/check-in.tsx`, `src/features/checkin/*`,
`src/services/checkin/*` (the wired copy -- see Risks).

### Data Dependencies
`qr_codes`, `business_locations`, `check_ins`;
`normaliseInvitation()` from `@waypoint/validation` (ADR-004 token format).

### Current Status
Working.

### Test Status
Live-verified end to end, signed in, against real data: resolve, confirm,
record, already-visited (per-location-per-day guard confirmed precise),
not-recognised (bad code), and the sign-in-required path. No automated
tests exist.

### Preserve
The explicit state machine (`checkInMachine.ts`); the write-time
re-check guard in `performCheckIn` (resolve-time and write-time checks
are deliberately separate); the opaque check-in ref handoff between
resolve and confirm.

### Improve
Fixed this session: check-in confirmation for a signed-out user now
offers a "Sign in to add this to your Passport" button instead of a
dead-end error; the walk-journal write now uses the already-resolved
`activeWalk` instead of re-fetching it (closed a narrow staleness
window). Camera-path haptics were already correctly wired
(`CheckInScan.tsx`); check-in-recorded and Field-Note-saved haptics were
added this session to match.

### Risks
`src/services/checkin/checkInMachine.ts` and `useCheckInJourney.ts` are a
dead, unused duplicate of the real (wired) versions under
`src/features/checkin/`. Not fixed this session -- low risk while
untouched, but a real risk if someone edits the wrong copy. Recommend
deleting them.

### MVP Recommendation
Preserve as-is. Delete the dead duplicate service-layer copy as cheap
cleanup.

## Passport Timeline

### Current User Journey
Tab shows a monthly-grouped timeline of check-ins, each with a
per-business VenueStamp mark, place/business name, optional
"Visited after {trail}" context line (only present when an active walk
was running at check-in time), and a stats row (Moments / Trails /
Places).

### Files / Routes
`app/(tabs)/passport.tsx`, `src/services/passport/*`,
`src/features/passport/*`, `src/features/stamps/*`.

### Data Dependencies
`check_ins`, `earned_stamps`, `stamp_definitions`, joined via
`src/services/passport/repository.ts`.

### Current Status
Working -- and the strongest screen in the app visually.

### Test Status
Live-verified signed in with real multi-entry history (5, then 6, then 7
moments across a session, updating correctly with no reload needed), and
anonymous empty state.

### Preserve
Live Supabase-backed (not cached/stale), monthly grouping, distinct
per-business VenueStamp marks via `resolveMark(businessName)`.

### Improve
Fixed this session: `getPassportStamps()`/`getPassportMoments()` were
checking `if (error) throw error` before `if (!data.user) return []` --
but `supabase.auth.getUser()` reports "no session" as an error, not just
a null user, so anonymous visitors saw a raw `"Auth session missing!"`
SDK string rendered directly in the UI. Order swapped; anonymous users
now see a proper empty state.

### Risks
Only two VenueStamp mark shapes (square, circular) observed so far --
worth confirming `resolveMark()` has enough variety as more businesses
are onboarded, or repeated shapes will dull the effect.

### MVP Recommendation
Preserve.

## Discover

### Current User Journey
Browse trails + places, free-text search, category/difficulty filter
chips that only render options that actually exist in the current
catalogue.

### Files / Routes
`app/(tabs)/discover.tsx`, `src/services/trails/*`, `src/services/places/*`.

### Data Dependencies
`trails` (`status = 'published'`), `business_locations`
(`status = 'active'`) joined to `businesses`.

### Current Status
Working.

### Test Status
Live-verified with real data, with a simulated total network failure
(all Supabase requests aborted), and re-verified after an initial false
alarm (a Metro Fast-Refresh timing artifact briefly looked like a
permanent hang; a clean flat 15s wait with request-level tracing showed
it resolves correctly to "Unable to load trails." / "No places match
yet.").

### Preserve
The `try/catch/finally` load pattern -- this is the reference
implementation the two broken detail screens (see Places, Trails below)
were fixed to match.

### Improve
Nothing outstanding.

### Risks
None identified.

### MVP Recommendation
Preserve; use as the pattern reference for any new list/load screen.

## Places

### Current User Journey
Place detail: hero, "Why it matters" / "Planning notes" (steward
content, when set), Walker welcome + Facilities chips, Official updates,
Recent Field Notes, Planning details, map placeholder.

### Files / Routes
`app/places/[id].tsx`, `src/services/places/*`,
`src/features/places/{placeExperience.ts,PlaceContentSections.tsx}`.

### Data Dependencies
`business_locations` -- including `walker_characteristics`,
`facilities`, `walking_context`, `place_story`, `accessibility_notes`,
`best_seasons` added across this session's `0005`/`0006` migrations.

### Current Status
Working.

### Test Status
Live-verified the fallback state (no steward data entered yet -- shows
category-default walker facts and an honest "Information not confirmed
yet" for facilities) and the not-found/error state. **Not** verified:
the real-steward-data render path end to end in the mobile app itself --
confirmed the Business Portal write pipeline works (fixed a crash in it
this session, `svelte-check` clean, save confirmed by the user), and
confirmed `mapPlace()`'s read side compiles and maps correctly, but no
steward account was available this session to fill in real data and
visually confirm the mobile screen picks it up.

### Preserve
The fallback-to-category-defaults behaviour in `getWalkerFacts()` /
`getPlaceFacilities()` -- the screen never reads as empty even before a
steward has entered anything.

### Improve
Fixed this session: `load()` had no `try/catch`, so a bad/deleted place
ID left the screen stuck on "Loading place..." forever with an
uncaught exception. Also fixed this session: `walker_characteristics`/
`facilities` are now actually read from the database (`mapPlace()`
previously hardcoded `facilities: []` regardless of what a steward had
saved).

### Risks
The real-steward-data render path (item above) is the one meaningful
gap in this session's testing -- recommend a manual check: sign into
the Business Portal for a demo location, tick a few walker-characteristic
/facility checkboxes, save, then reload that place in the mobile app.

### MVP Recommendation
Working; close the one remaining verification gap when a steward
account is available.

## Trails

### Current User Journey
Trail detail -> Start this walk -> ActiveWalkBanner/-Pill appears across
screens -> check in at a place while the walk is active (written to a
local walk journal) -> Finish walk -> walk summary (lists journal
entries, or a graceful "not every good walk needs a stamp" empty state)
-> Finish and save walk clears the walk and returns to Passport.

### Files / Routes
`app/trail/[slug].tsx`, `app/walk/finish.tsx`,
`src/services/walks/*`, `src/features/walks/*`.

### Data Dependencies
`trails`, `check_ins.trail_id`; the active walk + its journal are
**local-only** (AsyncStorage), deliberately not a database entity per
BP022 ("ambient context earns a database row only after its first real
exception").

### Current Status
Working.

### Test Status
Live-verified: start walk, banner/pill appearance, finish-walk summary
(empty-journal state), and the daily-visit-guard interaction with an
active walk. **Not** verified: a finish-walk summary with actual journal
entries in it -- the two demo locations were both already checked into
earlier in the same test session, so every attempt to add a fresh
journal entry hit the (correct) already-visited guard instead. The
underlying write logic (`addVisitToActiveWalk`) was code-reviewed and
its race condition fixed, but the populated-timeline UI itself was never
seen rendered.

### Preserve
One-walk-max with explicit switch-confirmation; journal keyed per
`trailId:startedAt` so a finished walk's history doesn't bleed into the
next one.

### Improve
Fixed this session: `load()` had no `try/catch` (same bug as Places) --
a bad/deleted trail slug left the screen stuck on "Loading trail..."
forever. Also fixed: `addVisitToActiveWalk` was re-fetching
`getActiveWalk()` internally instead of using the value the caller
already had, risking a mismatch between the walk a check-in was
attributed to and the walk its journal entry landed in.

### Risks
Populated-journal rendering is unverified (see Test Status). Low risk --
the component's mapping logic is simple and was read carefully -- but
worth a real look once more demo locations exist.

### MVP Recommendation
Working; the pattern (local ambient state, not promoted to a DB entity
until it earns it) is sound and worth preserving as a template for
similar "session-scoped" features.

## Map

### Current User Journey
Web: deliberate fallback message ("The map needs the Waypoint app on
your phone -- MapLibre doesn't render in a browser."). Native: MapLibre
map with user location dot and place markers.

### Files / Routes
`app/(tabs)/map.tsx`, `src/features/map/WalkingMap.tsx`.

### Data Dependencies
`business_location_map_points` view (security-invoker; exposes plain
lon/lat instead of WKB-hex geography).

### Current Status
Partially working. Per the README, trail centre is currently hardcoded
to Mam Tor pending real trail geometry.

### Test Status
Web fallback message verified live. **Native MapLibre rendering was not
tested this session** -- no device or simulator available in this
environment. This is the single biggest gap in this audit pass.

### Preserve
The platform gating and the honest, specific fallback copy (it explains
why, not just "unavailable").

### Improve
Hardcoded trail centre (known, pre-existing, documented in README).

### Risks
Entirely unverified on native this pass -- can't rule out rendering,
performance, or permission-flow issues without a physical/simulator
check.

### MVP Recommendation
Needs a native device/simulator verification pass before this item can
be marked Working with the same confidence as the rest of the app.

## Authentication

### Current User Journey
Sign in / create account at `/auth`; session persists via Supabase
across screens and reloads. Anonymous browsing is allowed for
Discover/Trail/Place detail; check-in confirmation, Passport, Field
Notes, and Account require a session.

### Files / Routes
`app/auth.tsx`, `src/features/auth/AuthProvider.tsx`.

### Data Dependencies
Supabase Auth (GoTrue).

### Current Status
Working.

### Test Status
Live-verified sign-in end to end with a real account (one transient
`Failed to fetch` on the very first attempt in a cold browser session --
traced with direct fetch calls and CORS preflight comparison, ruled out
as environmental/startup flakiness, not an app bug; a clean retry
succeeded immediately). Session correctly persisted and reflected across
Account, Passport, and check-in screens.

### Preserve
The optional-auth model itself -- browsing works with no account, and
signing in is only required at the point of actually keeping something.

### Improve
Fixed this session: check-in's "you must be signed in" failure state
had no path forward (see QR Check-in above).

### Risks
None outstanding from this session's testing.

### MVP Recommendation
Preserve.

## Offline / Error Behaviour

### Current User Journey
Cross-cutting -- how each screen behaves when a request fails or
returns nothing.

### Files / Routes
`discover.tsx` (reference-correct pattern); `places/[id].tsx` and
`trail/[slug].tsx` (both fixed this session).

### Current Status
Working, after this session's fixes.

### Test Status
Live-verified: bad/garbage QR code (correctly shows "not recognised"),
nonexistent place ID and nonexistent trail slug (both previously hung
forever -- now fixed and confirmed resolving to a proper "not found"
message), and a fully simulated network outage on Discover (confirmed
correct after ruling out a polling-timing false alarm).

### Preserve
`discover.tsx`'s `try/catch/finally` pattern, now matched by
`places/[id].tsx` and `trail/[slug].tsx`.

### Improve
Fixed this session: both `places/[id].tsx` and `trail/[slug].tsx` had no
`try/catch` around their data load, so any thrown error (not just "not
found" -- any network/RLS error too) left the screen stuck on its
loading text forever, with an uncaught exception in the console.

### Risks
Only these three screens were checked for the missing-try/catch pattern
specifically. `passport.tsx` already had proper handling; the check-in
flow has its own state-machine-driven error states. A final grep sweep
for any other bare `useEffect` + `await` with no surrounding
`try/catch` would be a cheap way to confirm there's nothing else like
this left.

### MVP Recommendation
Pattern is now consistent across every screen audited this session;
recommend the grep sweep above as a low-cost final check.

## Visual Consistency

### Current Status
Working / strong.

### Test Status
Screenshots captured across every major screen this session (onboarding,
Discover, Trail/Place detail, check-in flow end to end, Passport,
Account, Map fallback).

### Preserve
The `DetailSection`/`Card`/`InfoChip`/`AppText` component system; the
earthy, muted palette used consistently; the typography scale.

### Improve
Minor, not fixed (low priority): empty-state presentation varies
slightly per screen (Field Notes uses a bordered card with a heading,
Discover uses plain muted text, Passport uses a single line). Worth a
pass if/when a shared `EmptyState` pattern is consolidated, not before.

### MVP Recommendation
No action needed.

## Accessibility

### Current Status
Working, after this session's fixes.

### Test Status
Live DOM/accessibility-tree inspection (not native VoiceOver/TalkBack --
see Risks) plus computed WCAG contrast ratios for the full theme
palette, cross-checked against which pairings are actually used for
text versus only as fills.

### Preserve
N/A -- this pass was corrective.

### Improve
Fixed this session: `PrimaryButton` (the single most-used interactive
component in the app) rendered as a bare, non-focusable `<div>` with no
role -- confirmed via live DOM inspection it now renders as a real
`<button role="button" tabindex="0">`. Same fix applied to `FilterChip`
(plus `accessibilityState={{selected}}`) and the remaining bare
`Pressable`s (`CheckInEntry`'s mode-switch links, `FieldNotePrompt`'s
"Skip for now", `ActiveWalkPill`'s "Change" link). Confirmed `Link
asChild` (used by `PlaceCard`/`TrailCard`) already produces correct
`<a role="link">` semantics automatically -- no fix needed there. Also
fixed a real contrast failure: `accent` (`#8A6F3D`) on `primarySoft`
measured 3.75:1, below the 4.5:1 AA minimum for normal text at 16px/
600-weight (its only live usage, `ActiveWalkPill`'s "Change" link);
darkened to `#6E5931` (5.29:1).

### Risks
No physical VoiceOver/TalkBack testing was performed -- web DOM
inspection confirms the underlying React Native accessibility props are
set correctly, and those same props drive native screen readers, but
this hasn't been physically confirmed on-device.

### MVP Recommendation
Re-verify with a native screen reader when device testing is available;
otherwise no further action needed.

## Field Notes Fit

Do not build Field Notes until the audit identifies the safest insertion
point.

Potential insertion points:

-   Place detail screen
-   Trail detail screen
-   Map marker action
-   Post-check-in prompt
-   Quick action during active walk

Preferred MVP approach:

-   Add Field Notes as a small, structured contribution attached to a
    place, trail segment, or QR location.
-   Avoid free-form social comments in Version 1.
-   Keep submission under 15 seconds.

**Resolved:** built as a post-check-in prompt (`FieldNotePrompt.tsx`,
inside `CheckInRecorded`), one-tap structured category selection with
optional short detail text, matching the "under 15 seconds" goal.
Display side (`RecentFieldNotes.tsx`) is wired into both Place and Trail
detail screens. Live-verified end to end this session, including the
save flow (category tap -> save -> confirmation), with a success haptic
added to match the check-in-recorded moment.

## MVP Recommendation

The mobile MVP should prove one loop:

``` text
Discover → Visit → Check in → Remember → Contribute
```

Anything that does not strengthen this loop should be deferred.
