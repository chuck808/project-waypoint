export type WalkerCharacteristicKey =
  | "boots_welcome"
  | "dogs_welcome"
  | "water_refill"
  | "outdoor_seating"
  | "packed_lunches"
  | "phone_charging"
  | "family_friendly"
  | "wheelchair_friendly";

export const walkerCharacteristicLabels: Record<WalkerCharacteristicKey, string> = {
  boots_welcome: "Boots welcome",
  dogs_welcome: "Dogs welcome",
  water_refill: "Water refill",
  outdoor_seating: "Outdoor seating",
  packed_lunches: "Packed lunches",
  phone_charging: "Phone charging",
  family_friendly: "Family friendly",
  wheelchair_friendly: "Wheelchair friendly",
};

export const walkerCharacteristicGlyphs: Record<WalkerCharacteristicKey, string> = {
  boots_welcome: "🥾",
  dogs_welcome: "🐕",
  water_refill: "💧",
  outdoor_seating: "🌿",
  packed_lunches: "🥪",
  phone_charging: "🔋",
  family_friendly: "👨‍👩‍👧",
  wheelchair_friendly: "♿",
};

export const walkerCharacteristicKeys = Object.keys(
  walkerCharacteristicLabels,
) as WalkerCharacteristicKey[];
