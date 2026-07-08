import { fieldNoteCategoryMeta } from "./metadata";
import type {
  FieldNote,
  FieldNoteCategory,
  FieldNoteSeverity,
  FieldNoteSource,
} from "./types";
import type { FieldNoteRow } from "./repository";

const categoryLabels: Record<FieldNoteCategory, string> = {
  mud_bog: fieldNoteCategoryMeta.mud_bog.label,
  bridge_stile_gate: fieldNoteCategoryMeta.bridge_stile_gate.label,
  fallen_tree: fieldNoteCategoryMeta.fallen_tree.label,
  livestock: fieldNoteCategoryMeta.livestock.label,
  water: fieldNoteCategoryMeta.water.label,
  weather: fieldNoteCategoryMeta.weather.label,
  access: fieldNoteCategoryMeta.access.label,
  facilities: fieldNoteCategoryMeta.facilities.label,
  welcome: fieldNoteCategoryMeta.welcome.label,
  viewpoint: fieldNoteCategoryMeta.viewpoint.label,
  other: fieldNoteCategoryMeta.other.label,
};

function isCategory(value: string): value is FieldNoteCategory {
  return value in categoryLabels;
}

function mapSeverity(value: string): FieldNoteSeverity {
  if (value === "watch" || value === "hazard") return value;
  return "info";
}

function mapSource(value: string): FieldNoteSource {
  if (value === "steward" || value === "admin") return value;
  return "explorer";
}

export function labelForFieldNoteCategory(category: FieldNoteCategory): string {
  return categoryLabels[category];
}

export function mapFieldNote(row: FieldNoteRow): FieldNote {
  const category = isCategory(row.category) ? row.category : "other";

  return {
    id: row.id,
    category,
    categoryLabel: categoryLabels[category],
    severity: mapSeverity(row.severity),
    ...(row.message ? { message: row.message } : {}),
    source: mapSource(row.source),
    observedAt: row.observed_at,
    ...(row.expires_at ? { expiresAt: row.expires_at } : {}),
  };
}
