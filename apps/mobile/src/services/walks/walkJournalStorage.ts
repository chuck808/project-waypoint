import AsyncStorage from "@react-native-async-storage/async-storage";
import type { WalkJournalEntry } from "./walkJournal";

const prefix = "waypoint:walk-journal:";

function keyForWalk(trailId: string, startedAt: string) {
  return `${prefix}${trailId}:${startedAt}`;
}

export async function readWalkJournal(
  trailId: string,
  startedAt: string,
): Promise<WalkJournalEntry[]> {
  const raw = await AsyncStorage.getItem(keyForWalk(trailId, startedAt));
  if (!raw) return [];

  try {
    return JSON.parse(raw) as WalkJournalEntry[];
  } catch {
    return [];
  }
}

export async function writeWalkJournal(
  trailId: string,
  startedAt: string,
  entries: WalkJournalEntry[],
): Promise<void> {
  await AsyncStorage.setItem(keyForWalk(trailId, startedAt), JSON.stringify(entries));
}

export async function clearWalkJournal(
  trailId: string,
  startedAt: string,
): Promise<void> {
  await AsyncStorage.removeItem(keyForWalk(trailId, startedAt));
}
