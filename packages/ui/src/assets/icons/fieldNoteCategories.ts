export type FieldNoteCategoryKey =
  | "mud_bog"
  | "bridge_stile_gate"
  | "fallen_tree"
  | "livestock"
  | "water"
  | "weather"
  | "access"
  | "facilities"
  | "welcome"
  | "viewpoint"
  | "other";

export const fieldNoteCategoryLabels: Record<FieldNoteCategoryKey, string> = {
  mud_bog: "Mud / bog",
  bridge_stile_gate: "Bridge / stile / gate",
  fallen_tree: "Fallen tree",
  livestock: "Livestock",
  water: "Water",
  weather: "Weather",
  access: "Access",
  facilities: "Facilities",
  welcome: "Welcome",
  viewpoint: "Viewpoint",
  other: "Other",
};

export const fieldNoteCategoryGlyphs: Record<FieldNoteCategoryKey, string> = {
  mud_bog: "≋",
  bridge_stile_gate: "╧",
  fallen_tree: "🌳",
  livestock: "🐑",
  water: "💧",
  weather: "☁",
  access: "↥",
  facilities: "⌂",
  welcome: "☕",
  viewpoint: "⌖",
  other: "•",
};
