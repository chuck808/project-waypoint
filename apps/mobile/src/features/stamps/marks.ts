/**
 * The stamp identity system: ink on paper.
 *
 * Five rules govern every mark -- stroke-only line work (ink, never
 * paint); each venue is a mark, not an icon in a circle; ink colour is
 * the category; rotation jitter is deterministic per moment; the date
 * can be pressed into the rim. Bespoke marks are registered by business
 * name; unknown venues get a monogram stamp in their category's ink,
 * so a third venue degrades gracefully rather than generically.
 *
 * When the Business Portal grows "design your stamp", these specs
 * become data authored there. Until then, two real venues, two
 * hand-made marks.
 */

export type StampFrame = "round" | "square";
export type StampMotif = "ridge" | "barn" | "monogram";

export type StampMark = {
  frame: StampFrame;
  ink: string;
  topText: string;
  bottomText?: string;
  motif: StampMotif;
  monogram?: string;
};

/** Ink by category -- the colour taxonomy, grounded in something. */
const CATEGORY_INK: Record<string, string> = {
  cafe: "#3c5f46",
  pub: "#8a5a2b",
  farm_shop: "#6b6b2a",
  campsite: "#3f5e6b",
  outdoor_shop: "#5a4a6b",
  attraction: "#7a3b4f",
  other: "#4f5648",
};

const BESPOKE_MARKS: Record<string, StampMark> = {
  "The Ramblers Rest": {
    frame: "round",
    ink: CATEGORY_INK.pub,
    topText: "THE RAMBLERS REST",
    bottomText: "CASTLETON",
    motif: "ridge",
  },
  "The Old Barn Café": {
    frame: "square",
    ink: CATEGORY_INK.cafe,
    topText: "OLD BARN",
    bottomText: "CAFÉ",
    motif: "barn",
  },
};

export function resolveMark(
  businessName: string,
  category?: string | null,
): StampMark {
  const bespoke = BESPOKE_MARKS[businessName];

  if (bespoke) return bespoke;

  return {
    frame: "round",
    ink: CATEGORY_INK[category ?? "other"] ?? CATEGORY_INK.other,
    topText: businessName.toUpperCase().slice(0, 20),
    motif: "monogram",
    monogram: businessName.trim().charAt(0).toUpperCase() || "W",
  };
}

/** Hand-pressed, not machine-placed: a stable tilt in [-8, 8] degrees
 *  derived from the seed, so a moment's stamp never fidgets between
 *  renders but no two moments sit identically. */
export function stampRotation(seed: string): number {
  let hash = 0;

  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }

  return (Math.abs(hash) % 17) - 8;
}
