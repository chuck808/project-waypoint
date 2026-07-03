import type { Database } from "@waypoint/database";
import type { Trail } from "@waypoint/types";

type TrailRow = Database["public"]["Tables"]["trails"]["Row"];

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
    region: "Peak District",
    distance: row.distance_km
      ? `${Number(row.distance_km).toFixed(1)} km`
      : "Unknown",

    difficulty: row.difficulty,
    duration: formatDuration(row.estimated_duration_minutes),
    type: row.trail_type,
    description: row.description ?? "",
  };
}
