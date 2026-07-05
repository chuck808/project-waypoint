import type { Database } from "@waypoint/database";
import { supabase } from "../../lib/supabase";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export async function getProfileRowByUserId(
  userId: string,
): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;

  return data;
}
