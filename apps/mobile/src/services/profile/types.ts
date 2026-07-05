/**
 * Local per BP022 -- promote to @waypoint/types only when a second
 * real consumer exists (see PassportMoment for the same reasoning).
 */
export type Profile = {
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
};
