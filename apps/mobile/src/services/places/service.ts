import type { Place } from "@waypoint/types";
import { mapPlace } from "./mapper";
import { getBusinessLocations } from "./repository";

export async function getPlaces(): Promise<Place[]> {
  const rows = await getBusinessLocations();

  return rows.map(mapPlace);
}
