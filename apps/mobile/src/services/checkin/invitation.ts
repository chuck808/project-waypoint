/**
 * ADR-004: alternative representations of an invitation — full URLs, bare
 * tokens, any letter case, missing or extra hyphens, misread ambiguous
 * characters — normalise to one canonical form before resolution.
 *
 * Canonical form: wp1-7XK4-Q2M9
 *   - lowercase version prefix (wp1)
 *   - uppercase Crockford base32 payload (alphabet excludes O/I/L/U;
 *     common misreadings are accepted and corrected during normalisation)
 *   - hyphen-grouped in fours for reading from a sign
 *
 * Inputs that don't look like Waypoint tokens pass through untouched, so
 * legacy demo tokens keep resolving until the seeds are replaced.
 */

export const CROCKFORD_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

export function normaliseInvitation(raw: string): string {
  let value = raw.trim();

  // URL form — https://waypoint.app/visit/{token}, with or without
  // scheme, query or fragment: take the segment after /visit/.
  const visitMatch = value.match(/\/visit\/([^/?#]+)/i);

  if (visitMatch) value = visitMatch[1];

  // Fold case and drop separators before deciding what we're holding.
  const compact = value.replace(/[\s-]/g, "").toLowerCase();

  if (!/^wp\d/.test(compact)) return value;

  const prefix = compact.slice(0, 3);

  // Forgive the misreadings Crockford base32 anticipates: a walker
  // squinting at a laminated sign can't tell O from 0 or l from 1.
  const payload = compact
    .slice(3)
    .replace(/o/g, "0")
    .replace(/[il]/g, "1")
    .toUpperCase();

  const groups = payload.match(/.{1,4}/g) ?? [];

  return [prefix, ...groups].join("-");
}
