export type EmptyStateKey =
  | "passport"
  | "fieldNotes"
  | "nearby"
  | "places"
  | "trails"
  | "stewardNotices"
  | "qrPosters"
  | "offline"
  | "search";

export const waypointEmptyStates: Record<EmptyStateKey, { title: string; body: string; action?: string; illustration: string }> = {
  passport: {
    title: "Your Passport is waiting for its first stamp.",
    body: "Check in somewhere meaningful and Waypoint will start building your walking story.",
    action: "Find somewhere to visit",
    illustration: "empty-passport",
  },
  fieldNotes: {
    title: "No recent Field Notes.",
    body: "Be the first to share something useful for the next walker.",
    action: "Leave a Field Note",
    illustration: "empty-field-notes",
  },
  nearby: {
    title: "Nothing nearby yet.",
    body: "Waypoint becomes more useful as walkers and stewards add local knowledge.",
    illustration: "empty-nearby",
  },
  places: {
    title: "No places found.",
    body: "Try widening your search or explore the map around you.",
    illustration: "empty-places",
  },
  trails: {
    title: "No walks found.",
    body: "Try a different search, or return when more trails have been added locally.",
    illustration: "empty-trails",
  },
  stewardNotices: {
    title: "No official notices.",
    body: "Temporary closures, seasonal changes and access updates will appear here.",
    action: "Publish notice",
    illustration: "empty-notices",
  },
  qrPosters: {
    title: "No QR checkpoint yet.",
    body: "Create a checkpoint poster so walkers can check in and remember their visit.",
    action: "Create poster",
    illustration: "empty-qr",
  },
  offline: {
    title: "You're offline. Your walk isn't.",
    body: "Waypoint will keep working where it can and sync again when the signal returns.",
    illustration: "empty-offline",
  },
  search: {
    title: "No matches.",
    body: "Try a simpler search or browse nearby places instead.",
    illustration: "empty-search",
  },
};
