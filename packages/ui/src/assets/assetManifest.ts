export type WaypointAssetKind = "icon" | "stamp" | "illustration" | "background" | "map-symbol";

export type WaypointAsset = {
  id: string;
  kind: WaypointAssetKind;
  path: string;
  label: string;
  tags: string[];
};

export const waypointAssets: WaypointAsset[] = [
  { id: "boots-welcome", kind: "icon", path: "assets/svg/facilities/boots-welcome.svg", label: "Boots welcome", tags: ["walker", "business"] },
  { id: "dogs-welcome", kind: "icon", path: "assets/svg/facilities/dogs-welcome.svg", label: "Dogs welcome", tags: ["walker", "business"] },
  { id: "water-refill", kind: "icon", path: "assets/svg/facilities/water-refill.svg", label: "Water refill", tags: ["facility"] },
  { id: "public-toilets", kind: "icon", path: "assets/svg/facilities/public-toilets.svg", label: "Public toilets", tags: ["facility"] },
  { id: "outdoor-seating", kind: "icon", path: "assets/svg/facilities/outdoor-seating.svg", label: "Outdoor seating", tags: ["facility"] },
  { id: "accessible", kind: "icon", path: "assets/svg/facilities/accessible.svg", label: "Accessible", tags: ["accessibility"] },
  { id: "stamp-first-walk", kind: "stamp", path: "assets/svg/passport-stamps/first-walk.svg", label: "First Walk", tags: ["passport"] },
  { id: "stamp-field-note", kind: "stamp", path: "assets/svg/passport-stamps/field-note.svg", label: "Helpful Field Note", tags: ["passport"] },
  { id: "empty-passport", kind: "illustration", path: "assets/svg/empty-states/passport.svg", label: "Empty Passport", tags: ["empty-state"] },
  { id: "empty-field-notes", kind: "illustration", path: "assets/svg/empty-states/field-notes.svg", label: "No Field Notes", tags: ["empty-state"] },
  { id: "contour-soft", kind: "background", path: "assets/svg/backgrounds/contour-soft.svg", label: "Soft contour background", tags: ["background"] },
  { id: "map-bridge", kind: "map-symbol", path: "assets/svg/map-symbols/bridge.svg", label: "Bridge", tags: ["map", "field-note"] }
];
