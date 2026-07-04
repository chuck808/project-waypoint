/**
 * QR resolution normalises generously (ADR-004, point 5): a scan or manual
 * entry may arrive as a full `/visit/{token}` URL, a bare token, any letter
 * case, or with hyphens missing, doubled, or misplaced. This module is the
 * single place that turns whatever arrived into the exact `code_value`
 * stored on `qr_codes` — everything downstream deals in canonical codes only.
 */

const WP1_PREFIX = "wp1";

/**
 * Normalises a scanned or typed check-in code into its canonical form.
 *
 * - Full URLs (current `/visit/{token}` shape, or any future path) have the
 *   token extracted from the last meaningful path segment.
 * - `wp1` tokens are lower-cased and re-grouped into `wp1-XXXX-XXXX`
 *   regardless of how the hyphens arrived, so scanning, typing, and pasting
 *   all converge on the same value.
 * - Anything else (legacy/demo `code_value`s, future non-`wp1` formats) is
 *   only trimmed — case is preserved, since those values are opaque and
 *   case may be meaningful. This function normalises shape, not meaning.
 */
export function normalizeCheckInCode(raw: string): string {
  const trimmed = raw.trim();

  if (!trimmed) return trimmed;

  const token = extractTokenFromUrl(trimmed);
  const lowered = token.toLowerCase();

  if (!lowered.startsWith(WP1_PREFIX)) {
    return token.trim();
  }

  return regroupWp1Token(lowered);
}

/**
 * Pulls the token out of a `/visit/{token}` URL (present or future, any
 * domain). Values that aren't URLs pass straight through unchanged.
 */
function extractTokenFromUrl(value: string): string {
  const looksLikeUrl =
    /^[a-z][a-z0-9+.-]*:\/\//i.test(value) || value.includes("/visit/");

  if (!looksLikeUrl) return value;

  try {
    const absolute = /^[a-z][a-z0-9+.-]*:\/\//i.test(value)
      ? value
      : `https://waypoint.invalid${value.startsWith("/") ? "" : "/"}${value}`;

    const url = new URL(absolute);
    const segments = url.pathname.split("/").filter(Boolean);
    const visitIndex = segments.indexOf("visit");

    if (visitIndex !== -1 && segments[visitIndex + 1]) {
      return segments[visitIndex + 1];
    }

    return segments[segments.length - 1] ?? value;
  } catch {
    return value;
  }
}

/**
 * Strips every hyphen from a lower-cased `wp1...` token, then re-inserts
 * them in 4-character groups after the prefix: `wp1-XXXX-XXXX`. A payload
 * that doesn't divide evenly still groups sensibly (a short trailing group
 * is expected for shorter or hand-typed tokens).
 */
function regroupWp1Token(loweredToken: string): string {
  const compact = loweredToken.replace(/-/g, "");
  const payload = compact.slice(WP1_PREFIX.length);

  if (!payload) return WP1_PREFIX;

  const grouped = payload.match(/.{1,4}/g)?.join("-") ?? payload;

  return `${WP1_PREFIX}-${grouped}`;
}
