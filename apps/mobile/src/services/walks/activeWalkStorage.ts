import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ActiveWalk } from "./types";

const KEY = "waypoint.activeWalk";

function isActiveWalk(value: unknown): value is ActiveWalk {
  if (typeof value !== "object" || value === null) return false;

  const walk = value as Record<string, unknown>;

  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  return (
    typeof walk.trailId === "string" &&
    UUID.test(walk.trailId) &&
    typeof walk.trailName === "string" &&
    typeof walk.startedAt === "string"
  );
}

export async function readActiveWalk(): Promise<ActiveWalk | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);

    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);

    return isActiveWalk(parsed) ? parsed : null;
  } catch {
    // Corrupted storage is treated as no walk; a false edge is worse
    // than a missing one.
    return null;
  }
}

export async function writeActiveWalk(walk: ActiveWalk): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(walk));
}

export async function clearActiveWalk(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
