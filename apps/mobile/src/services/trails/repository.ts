import { supabase } from "../../lib/supabase";
import type { Database } from "@waypoint/database";

type TrailRow = Database["public"]["Tables"]["trails"]["Row"];

export async function getPublishedTrailRows(): Promise<TrailRow[]> {
  const { data, error } = await supabase
    .from("trails")
    .select(
      `
      *,
      trail_regions (
        region:regions (
          name
        )
      )
    `,
    )
    .eq("status", "published")
    .order("name");

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getTrailRowBySlug(
  slug: string,
): Promise<TrailRow | null> {
  const { data, error } = await supabase
    .from("trails")
    .select(
      `
      *,
      trail_regions (
        regions (
          name
        )
      )
    `,
    )
    .eq("slug", slug)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
