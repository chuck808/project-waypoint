import type { PassportStamp } from "@waypoint/types";
import { supabase } from "../../lib/supabase";
import { mapPassportStamp } from "./mapper";
import { getEarnedStampRows } from "./repository";

export async function getPassportStamps(): Promise<PassportStamp[]> {
  const { data, error } = await supabase.auth.getUser();

  // No session is not a failure -- getUser() reports it as an error
  // ("Auth session missing!") rather than a bare null user, so the
  // signed-out case must be checked before the error is treated as real.
  if (!data.user) return [];
  if (error) throw error;

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

  // Same as getPassportStamps: signed-out is reported as an error, not
  // just a null user, so it must be checked first.
  if (!data.user) return [];
  if (error) throw error;

  const rows = await getCheckInRows(data.user.id);
  const stamps = await getStampsForCheckIns(rows.map((row) => row.id));

  const stampsByCheckIn = new Map<string, CheckInStampRow>();

  for (const stamp of stamps) {
    if (stamp.source_id) stampsByCheckIn.set(stamp.source_id, stamp);
  }

  return rows.map((row) => mapPassportMoment(row, stampsByCheckIn));
}
