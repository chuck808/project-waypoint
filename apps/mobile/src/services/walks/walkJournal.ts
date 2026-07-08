import { getActiveWalk } from "./service";
import type { ActiveWalk } from "./types";
import {
  clearWalkJournal,
  readWalkJournal,
  writeWalkJournal,
} from "./walkJournalStorage";

export type WalkJournalEntry = {
  checkInId: string;
  businessLocationId: string;
  placeName: string;
  businessName: string;
  visitedAt: string;
};

/**
 * Takes the caller's already-resolved ActiveWalk rather than re-fetching
 * one, so the journal entry is written against the exact same walk that
 * was used to decide the check-in's trailId -- not whatever getActiveWalk()
 * happens to return moments later, after the check-in's DB round-trip.
 */
export async function addVisitToActiveWalk(
  activeWalk: ActiveWalk,
  entry: WalkJournalEntry,
): Promise<void> {
  const entries = await readWalkJournal(activeWalk.trailId, activeWalk.startedAt);

  if (entries.some((item) => item.checkInId === entry.checkInId)) {
    return;
  }

  await writeWalkJournal(activeWalk.trailId, activeWalk.startedAt, [
    ...entries,
    entry,
  ]);
}

export async function getActiveWalkJournal(): Promise<WalkJournalEntry[]> {
  const activeWalk = await getActiveWalk();
  if (!activeWalk) return [];

  return readWalkJournal(activeWalk.trailId, activeWalk.startedAt);
}

export async function clearActiveWalkJournal(): Promise<void> {
  const activeWalk = await getActiveWalk();
  if (!activeWalk) return;

  await clearWalkJournal(activeWalk.trailId, activeWalk.startedAt);
}
