import {
  CloudSun,
  Coffee,
  Construction,
  Droplets,
  Fence,
  Footprints,
  House,
  Mountain,
  PawPrint,
  Pencil,
  TreePine,
  type LucideIcon,
} from "lucide-react-native";
import type {
  FieldNoteCategory,
  FieldNoteSeverity,
  FieldNoteSource,
} from "./types";

export type FieldNoteCategoryMeta = {
  label: string;
  shortLabel: string;
  icon: LucideIcon;
};

export const fieldNoteCategoryMeta: Record<
  FieldNoteCategory,
  FieldNoteCategoryMeta
> = {
  mud_bog: { label: "Muddy / boggy", shortLabel: "Boggy", icon: Footprints },
  bridge_stile_gate: {
    label: "Bridge / stile / gate",
    shortLabel: "Bridge",
    icon: Fence,
  },
  fallen_tree: { label: "Fallen tree", shortLabel: "Tree down", icon: TreePine },
  livestock: { label: "Livestock", shortLabel: "Livestock", icon: PawPrint },
  water: { label: "Water", shortLabel: "Water", icon: Droplets },
  weather: { label: "Weather", shortLabel: "Weather", icon: CloudSun },
  access: { label: "Access", shortLabel: "Access", icon: Construction },
  facilities: { label: "Facilities", shortLabel: "Facilities", icon: House },
  welcome: { label: "Welcome", shortLabel: "Welcome", icon: Coffee },
  viewpoint: { label: "Viewpoint", shortLabel: "View", icon: Mountain },
  other: { label: "Other", shortLabel: "Note", icon: Pencil },
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
