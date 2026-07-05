import type { PlaceCategory } from "@waypoint/types";

/**
 * One remembered visit — a check-in told in Waypoint's language.
 *
 * The unit is the check-in, not the stamp: a visit that awarded nothing
 * is still a memory. The stamp is optional decoration; trailName is
 * present only when the visit -> trail edge was captured at write time
 * (never inferred). Local per BP022 — promote to @waypoint/types only
 * when a second real consumer exists.
 */
export type PassportMoment = {
  id: string;
  occurredAt: string;
  placeName: string;
  businessName: string;
  placeCategory?: PlaceCategory;
  stamp?: {
    title: string;
    imageUrl?: string;
  };
  trailName?: string;
};
