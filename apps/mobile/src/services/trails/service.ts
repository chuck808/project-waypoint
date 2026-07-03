import type { Trail } from "@waypoint/types";
import { mapTrail } from "./mapper";
import { getPublishedTrailRows, getTrailRowBySlug } from "./repository";

export async function getTrails(): Promise<Trail[]> {
  const rows = await getPublishedTrailRows();
  return rows.map(mapTrail);
}

export async function getTrail(slug: string): Promise<Trail | null> {
  const row = await getTrailRowBySlug(slug);

  if (!row) {
    return null;
  }

  return mapTrail(row);
}
