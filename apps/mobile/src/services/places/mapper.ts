import type { Place, PlaceCategory } from "@waypoint/types";
import { facilityKeys, walkerCharacteristicKeys } from "@waypoint/ui";
import { isPlaceCategory } from "../../theme/categoryStyles";
import type { PlaceMapPointRow } from "./repository";

type BusinessLocationRow = any;

/**
 * business_locations.walker_characteristics/facilities are jsonb maps of
 * key -> boolean, written by the Steward Portal's checkbox forms. Only
 * keys @waypoint/ui actually knows about survive -- an unrecognised key
 * (renamed column, stale data) is silently dropped rather than shown as
 * a raw, unlabelled string.
 */
function enabledKeys(value: unknown, validKeys: readonly string[]): string[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];

  const record = value as Record<string, unknown>;
  return validKeys.filter((key) => record[key] === true);
}

export function mapPlace(row: BusinessLocationRow): Place {
  const walkerCharacteristics = enabledKeys(
    row.walker_characteristics,
    walkerCharacteristicKeys,
  );
  const facilities = enabledKeys(row.facilities, facilityKeys);

  return {
    id: row.id,
    name: row.name,
    category: row.businesses?.category ?? "other",
    displayCategory: row.businesses?.category?.replace("_", " ") ?? "Place",

    description: row.businesses?.description ?? "No description available.",

    note: "",

    distance: "Nearby",

    facilities,

    welcome: "Walker friendly",

    openingHours: "See venue",

    ...(walkerCharacteristics.length ? { walkerCharacteristics } : {}),
    ...(row.walking_context ? { walkingContext: row.walking_context } : {}),
    ...(row.place_story ? { placeStory: row.place_story } : {}),
    ...(row.accessibility_notes
      ? { accessibilityNotes: row.accessibility_notes }
      : {}),
    ...(row.best_seasons?.length ? { bestSeasons: row.best_seasons } : {}),
    ...(row.welcome_message ? { welcomeMessage: row.welcome_message } : {}),
    ...(row.steward_notice ? { stewardNotice: row.steward_notice } : {}),
    ...(row.seasonal_information
      ? { seasonalInformation: row.seasonal_information }
      : {}),
  };
}

export type PlaceMapPoint = {
  id: string;
  name: string;
  category: PlaceCategory;
  longitude: number;
  latitude: number;
};

export function mapPlaceMapPoint(row: PlaceMapPointRow): PlaceMapPoint {
  return {
    id: row.id,
    name: row.name,
    category: isPlaceCategory(row.category) ? row.category : "other",
    longitude: row.longitude,
    latitude: row.latitude,
  };
}
