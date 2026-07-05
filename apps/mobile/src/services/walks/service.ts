import { startOfVenueDayISO } from "../checkin/time";
import {
  clearActiveWalk,
  readActiveWalk,
  writeActiveWalk,
} from "./activeWalkStorage";
import type { ActiveWalk } from "./types";

/**
 * Pure expiry rule, exported for testing: a walk belongs to the venue
 * day it started in. Stale context is worse than missing context -- a
 * forgotten Tuesday walk must never stamp a Friday visit.
 */
export function hasExpired(walk: ActiveWalk, venueDayStartISO: string): boolean {
  return walk.startedAt < venueDayStartISO;
}

export async function getActiveWalk(): Promise<ActiveWalk | null> {
  const walk = await readActiveWalk();

  if (!walk) return null;

  if (hasExpired(walk, startOfVenueDayISO())) {
    await clearActiveWalk();
    return null;
  }

  return walk;
}

/** Starting is a deliberate ceremony. One walk max: starting a new one
 *  replaces any current walk, and the UI says so before the tap. */
export async function startWalk(
  trailId: string,
  trailName: string,
): Promise<ActiveWalk> {
  const walk: ActiveWalk = {
    trailId,
    trailName,
    startedAt: new Date().toISOString(),
  };

  await writeActiveWalk(walk);

  return walk;
}

export async function finishWalk(): Promise<void> {
  await clearActiveWalk();
}
