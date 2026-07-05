import type { Place } from "@waypoint/types";
import { mapPlace, mapPlaceMapPoint, type PlaceMapPoint } from "./mapper";
import {
  getBusinessLocationById,
  getBusinessLocations,
  getPlaceMapPointRows,
} from "./repository";

export async function getPlaces(): Promise<Place[]> {
  const rows = await getBusinessLocations();
  return rows.map(mapPlace);
}

export async function getPlace(id: string): Promise<Place | null> {
  const row = await getBusinessLocationById(id);

  if (!row) return null;

  return mapPlace(row);
}

export async function getPlaceMapPoints(): Promise<PlaceMapPoint[]> {
  const rows = await getPlaceMapPointRows();
  return rows.map(mapPlaceMapPoint);
}
