import type { Place, PlaceCategory } from "@waypoint/types";
import { isPlaceCategory } from "../../theme/categoryStyles";
import type { PlaceMapPointRow } from "./repository";

type BusinessLocationRow = any;

export function mapPlace(row: BusinessLocationRow): Place {
  return {
    id: row.id,
    name: row.name,
    category: row.businesses?.category ?? "other",
    displayCategory: row.businesses?.category?.replace("_", " ") ?? "Place",

    description: row.businesses?.description ?? "No description available.",

    note: "",

    distance: "Nearby",

    facilities: [],

    welcome: "Walker friendly",

    openingHours: "See venue",
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
