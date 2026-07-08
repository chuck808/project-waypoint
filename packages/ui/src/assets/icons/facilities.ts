export type FacilityKey =
  | "toilets"
  | "parking"
  | "bike_parking"
  | "public_transport"
  | "wifi"
  | "food"
  | "hot_drinks"
  | "shelter";

export const facilityLabels: Record<FacilityKey, string> = {
  toilets: "Toilets",
  parking: "Parking",
  bike_parking: "Bike parking",
  public_transport: "Public transport nearby",
  wifi: "Wi‑Fi",
  food: "Food",
  hot_drinks: "Hot drinks",
  shelter: "Shelter",
};

export const facilityGlyphs: Record<FacilityKey, string> = {
  toilets: "🚻",
  parking: "🅿️",
  bike_parking: "🚲",
  public_transport: "🚌",
  wifi: "⌁",
  food: "🍽️",
  hot_drinks: "☕",
  shelter: "🏠",
};

export const facilityKeys = Object.keys(facilityLabels) as FacilityKey[];
