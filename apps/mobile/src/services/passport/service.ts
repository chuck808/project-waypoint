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

import { mapPassportMoment } from "./mapper";
import {
  getCheckInRows,
  getStampsForCheckIns,
  type CheckInStampRow,
} from "./repository";
import type { PassportMoment } from "./types";

export async function getPassportMoments(): Promise<PassportMoment[]> {
  const { data, error } = await supabase.auth.getUser();

  if (error) throw error;
  if (!data.user) return [];

  const rows = await getCheckInRows(data.user.id);
  const stamps = await getStampsForCheckIns(rows.map((row) => row.id));

  const stampsByCheckIn = new Map<string, CheckInStampRow>();

  for (const stamp of stamps) {
    if (stamp.source_id) stampsByCheckIn.set(stamp.source_id, stamp);
  }

  return rows.map((row) => mapPassportMoment(row, stampsByCheckIn));
}
