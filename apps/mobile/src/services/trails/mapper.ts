import type { Database } from "@waypoint/database";
import type { Trail, TrailDifficulty, TrailType } from "@waypoint/types";

type TrailRow = Database["public"]["Tables"]["trails"]["Row"] & {
  trail_regions?: {
    region?: {
      name: string;
    } | null;
  }[];
};

function mapDifficulty(value: string): TrailDifficulty {
  if (
    value === "easy" ||
    value === "moderate" ||
    value === "hard" ||
    value === "expert"
  ) {
    return value;
  }

  return "moderate";
}

function mapTrailType(value: string): TrailType {
  if (value === "circular" || value === "linear" || value === "out_and_back") {
    return value;
  }

  return "circular";
}

function formatDuration(minutes: number | null): string {
  if (!minutes) return "Unknown";

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours && mins) {
    return `${hours}h ${mins}m`;
  }

  if (hours) {
    return `${hours}h`;
  }

  return `${mins}m`;
}

export function mapTrail(row: TrailRow): Trail {
  return {
    id: row.slug,
    name: row.name,
    region: row.trail_regions?.[0]?.region?.name ?? "Unknown region",
    distance: row.distance_km
      ? `${Number(row.distance_km).toFixed(1)} km`
      : "Unknown",

    difficulty: mapDifficulty(row.difficulty),
    duration: formatDuration(row.estimated_duration_minutes),
    type: mapTrailType(row.trail_type),
    description: row.description ?? "",
  };
}
