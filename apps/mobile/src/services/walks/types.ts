/**
 * The walk the person is currently on. At most one; ends explicitly or
 * expires with the venue day. Ambient context, not a database row --
 * per ruling, the session entity waits for its first real exception
 * (BP022). trailName is denormalised so no screen fetches just to say it.
 */
export type ActiveWalk = {
  trailId: string;
  trailName: string;
  startedAt: string;
};
