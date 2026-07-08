import type { FieldNoteCategory, FieldNoteSeverity, FieldNoteSource } from "./types";

export type FieldNoteCategoryMeta = {
  label: string;
  shortLabel: string;
  glyph: string;
};

export const fieldNoteCategoryMeta: Record<FieldNoteCategory, FieldNoteCategoryMeta> = {
  mud_bog: { label: "Muddy / boggy", shortLabel: "Boggy", glyph: "🥾" },
  bridge_stile_gate: { label: "Bridge / stile / gate", shortLabel: "Bridge", glyph: "🌉" },
  fallen_tree: { label: "Fallen tree", shortLabel: "Tree down", glyph: "🌳" },
  livestock: { label: "Livestock", shortLabel: "Livestock", glyph: "🐑" },
  water: { label: "Water", shortLabel: "Water", glyph: "💧" },
  weather: { label: "Weather", shortLabel: "Weather", glyph: "🌦" },
  access: { label: "Access", shortLabel: "Access", glyph: "🚧" },
  facilities: { label: "Facilities", shortLabel: "Facilities", glyph: "🚻" },
  welcome: { label: "Welcome", shortLabel: "Welcome", glyph: "☕" },
  viewpoint: { label: "Viewpoint", shortLabel: "View", glyph: "⛰" },
  other: { label: "Other", shortLabel: "Note", glyph: "✎" },
};

export const fieldNoteSeverityLabels: Record<FieldNoteSeverity, string> = {
  info: "Info",
  watch: "Watch",
  hazard: "Hazard",
};

export const fieldNoteSourceLabels: Record<FieldNoteSource, string> = {
  explorer: "Walker note",
  steward: "Official note",
  admin: "Waypoint note",
};

export function getFieldNoteCategoryMeta(
  category: FieldNoteCategory,
): FieldNoteCategoryMeta {
  return fieldNoteCategoryMeta[category];
}
