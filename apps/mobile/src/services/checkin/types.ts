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
