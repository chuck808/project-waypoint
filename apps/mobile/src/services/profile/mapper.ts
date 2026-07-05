import type { Database } from "@waypoint/database";
import type { Profile } from "./types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export function mapProfile(row: ProfileRow): Profile {
  return {
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    bio: row.bio,
  };
}
