import type { PlaceCategory } from "@waypoint/types";

/**
 * Visual identity per place category, shared by anything that represents
 * a place at a glance (Discover's place rows, Passport's moment icons).
 * Colours stay within the app's muted, earthy register rather than a
 * full-saturation category-colour system.
 */
export type CategoryStyle = {
  icon: string;
  bg: string;
  fg: string;
};

const categoryStyles: Record<PlaceCategory, CategoryStyle> = {
  cafe: { icon: "☕", bg: "#EFE3D0", fg: "#8A6F3D" },
  pub: { icon: "🍺", bg: "#E8D9C7", fg: "#6B4A2A" },
  farm_shop: { icon: "🧺", bg: "#DDE8D5", fg: "#3C5F46" },
  campsite: { icon: "⛺", bg: "#DCE6D4", fg: "#4A6741" },
  outdoor_shop: { icon: "🎒", bg: "#DDE3E6", fg: "#3D5A66" },
  attraction: { icon: "🏛", bg: "#EDE0C8", fg: "#8A6D2F" },
  other: { icon: "📍", bg: "#EDEAE2", fg: "#4F5648" },
};

export function getCategoryStyle(category: PlaceCategory): CategoryStyle {
  return categoryStyles[category];
}

export function isPlaceCategory(value: string): value is PlaceCategory {
  return value in categoryStyles;
}
