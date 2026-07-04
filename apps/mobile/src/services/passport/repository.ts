import type { Database } from "@waypoint/database";
import { supabase } from "../../lib/supabase";

type EarnedStampRow = Database["public"]["Tables"]["earned_stamps"]["Row"] & {
  stamp_definitions?:
    Database["public"]["Tables"]["stamp_definitions"]["Row"] | null;
};

export async function getEarnedStampRows(
  userId: string,
): Promise<EarnedStampRow[]> {
  const { data: passport, error: passportError } = await supabase
    .from("passports")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (passportError) throw passportError;

  const { data, error } = await supabase
    .from("earned_stamps")
    .select(
      `
      *,
      stamp_definitions (*)
    `,
    )
    .eq("passport_id", passport.id)
    .order("earned_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
}

export type CheckInMomentRow = {
  id: string;
  checked_in_at: string;
  business_locations: {
    name: string | null;
    businesses: { name: string } | null;
  } | null;
  trails: { name: string } | null;
};

export type CheckInStampRow = {
  source_id: string | null;
  stamp_definitions: { title: string; image_url: string | null } | null;
};

export async function getCheckInRows(
  userId: string,
): Promise<CheckInMomentRow[]> {
  const { data, error } = await supabase
    .from("check_ins")
    .select(
      `
      id,
      checked_in_at,
      business_locations ( name, businesses ( name ) ),
      trails ( name )
    `,
    )
    .eq("user_id", userId)
    .neq("verification_status", "rejected")
    .order("checked_in_at", { ascending: false });

  if (error) throw error;

  return (data ?? []) as unknown as CheckInMomentRow[];
}

/**
 * earned_stamps.source_id is polymorphic (no foreign key), so PostgREST
 * cannot embed stamps from check_ins. Fetched separately and stitched
 * in the service.
 */
export async function getStampsForCheckIns(
  checkInIds: string[],
): Promise<CheckInStampRow[]> {
  if (checkInIds.length === 0) return [];

  const { data, error } = await supabase
    .from("earned_stamps")
    .select(
      `
      source_id,
      stamp_definitions ( title, image_url )
    `,
    )
    .eq("source_type", "check_in")
    .in("source_id", checkInIds);

  if (error) throw error;

  return (data ?? []) as unknown as CheckInStampRow[];
}
