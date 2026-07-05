import { mapProfile } from "./mapper";
import { getProfileRowByUserId } from "./repository";
import type { Profile } from "./types";

export async function getMyProfile(userId: string): Promise<Profile | null> {
  const row = await getProfileRowByUserId(userId);

  if (!row) return null;

  return mapProfile(row);
}
