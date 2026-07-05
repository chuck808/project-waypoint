import { supabase } from "../../lib/supabase";
import type { Database } from "@waypoint/database";

type BusinessLocationRow =
  Database["public"]["Tables"]["business_locations"]["Row"] & {
    businesses?: Database["public"]["Tables"]["businesses"]["Row"] | null;
  };

export async function getBusinessLocations(): Promise<BusinessLocationRow[]> {
  const { data, error } = await supabase
    .from("business_locations")
    .select(
      `
      *,
      businesses (*)
    `,
    )
    .eq("status", "active")
    .order("name");

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getBusinessLocationById(
  id: string,
): Promise<BusinessLocationRow | null> {
  const { data, error } = await supabase
    .from("business_locations")
    .select(
      `
      *,
      businesses (*)
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export type PlaceMapPointRow = {
  id: string;
  name: string;
  category: string;
  longitude: number;
  latitude: number;
};

/**
 * business_location_map_points is a security-invoker view (status
 * filtered) that exposes plain longitude/latitude -- PostgREST would
 * otherwise return the underlying geography column as WKB hex, which
 * no client here parses.
 */
export async function getPlaceMapPointRows(): Promise<PlaceMapPointRow[]> {
  const { data, error } = await supabase
    .from("business_location_map_points")
    .select("id, name, category, longitude, latitude");

  if (error) throw error;

  return (data ?? []).filter(
    (row): row is PlaceMapPointRow =>
      typeof row.longitude === "number" && typeof row.latitude === "number",
  );
}
