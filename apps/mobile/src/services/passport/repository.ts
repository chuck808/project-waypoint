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
