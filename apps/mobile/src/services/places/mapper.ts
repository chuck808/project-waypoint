import type { Place } from "@waypoint/types";

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
