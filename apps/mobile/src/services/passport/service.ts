import type { PassportStamp } from "@waypoint/types";
import { supabase } from "../../lib/supabase";
import { mapPassportStamp } from "./mapper";
import { getEarnedStampRows } from "./repository";

export async function getPassportStamps(): Promise<PassportStamp[]> {
  const { data, error } = await supabase.auth.getUser();

  if (error) throw error;
  if (!data.user) return [];

  const rows = await getEarnedStampRows(data.user.id);

  return rows.map(mapPassportStamp);
}
