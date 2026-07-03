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
