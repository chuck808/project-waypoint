import type { Trail } from "@waypoint/types";
import { supabase } from "../../lib/supabase";

type TrailRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  difficulty: Trail["difficulty"];
  distance_km: number | null;
  estimated_duration_minutes: number | null;
  trail_type: Trail["type"];
};

function formatDuration(minutes: number | null): string {
  if (!minutes) return "Unknown duration";

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours && mins) return `${hours}h ${mins}m`;
  if (hours) return `${hours}h`;
  return `${mins}m`;
}

function mapTrail(row: TrailRow): Trail {
  return {
    id: row.slug,
    name: row.name,
    region: "Peak District",
    distance: row.distance_km ? `${row.distance_km} km` : "Unknown distance",
    difficulty: row.difficulty,
    duration: formatDuration(row.estimated_duration_minutes),
    type: row.trail_type,
    description: row.description ?? "",
  };
}

export async function getTrails(): Promise<Trail[]> {
  const { data, error } = await supabase
    .from("trails")
    .select(
      "id, name, slug, description, difficulty, distance_km, estimated_duration_minutes, trail_type",
    )
    .eq("status", "published")
    .order("name");

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapTrail);
}
