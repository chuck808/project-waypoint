/** How the code physically arrived. Captured at entry, never defaulted.
 *  'gps' and 'offline_sync' exist in the schema for future capture paths. */
export type CheckInMethod = "qr" | "manual";

export type StampPreview = {
  title: string;
  imageUrl?: string;
};

export type CheckInResolution =
  | {
      outcome: "ready";
      placeName: string;
      businessName: string;
      welcomeMessage?: string;
      stamp?: StampPreview;
      checkInRef: string;
    }
  | {
      outcome: "already_visited";
      placeName: string;
      businessName: string;
      lastVisitedAt: string;
    }
  | {
      outcome: "not_recognised";
      reason: "unknown_code" | "expired" | "revoked" | "place_unavailable";
    };

export type PerformCheckInResult =
  | {
      outcome: "recorded";
      message: string;
      checkInId: string;
      businessLocationId: string;
      trailId?: string;
      recognition?: { title: string };
    }
  | {
      outcome: "already_visited";
      placeName?: string;
      businessName?: string;
      lastVisitedAt: string;
    }
  | {
      outcome: "failed";
      reason: string;
    };
