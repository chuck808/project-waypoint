import {
  BookOpen,
  Coffee,
  Compass,
  CloudSun,
  Backpack,
  Droplets,
  Dog,
  Footprints,
  Info,
  Landmark,
  MapPin,
  Sandwich,
  ShoppingBasket,
  Tent,
  Utensils,
  type LucideIcon,
} from "lucide-react-native";
import type { Place, PlaceCategory } from "@waypoint/types";
import { facilityLabels, walkerCharacteristicLabels } from "@waypoint/ui";
import {
  facilityIcons,
  fallbackFactIcons,
  walkerCharacteristicIcons,
} from "../../theme/factIcons";

type WalkerFact = {
  label: string;
  icon: LucideIcon;
};

const categoryFacts: Record<PlaceCategory, WalkerFact[]> = {
  cafe: [
    { label: "Boots welcome", icon: Footprints },
    { label: "Water refill", icon: Droplets },
    { label: "Good rest stop", icon: Coffee },
  ],
  pub: [
    { label: "Boots welcome", icon: Footprints },
    { label: "Dogs often welcome", icon: Dog },
    { label: "Food after a walk", icon: Utensils },
  ],
  farm_shop: [
    { label: "Local supplies", icon: ShoppingBasket },
    { label: "Good picnic stop", icon: Sandwich },
  ],
  campsite: [
    { label: "Overnight stop", icon: Tent },
    { label: "Water nearby", icon: Droplets },
  ],
  outdoor_shop: [
    { label: "Kit and repairs", icon: Backpack },
    { label: "Weather advice", icon: CloudSun },
  ],
  attraction: [
    { label: "Worth lingering", icon: Landmark },
    { label: "Good memory stop", icon: BookOpen },
  ],
  other: [{ label: "Useful waypoint", icon: MapPin }],
};

export function getWalkerFacts(place: Place): WalkerFact[] {
  if (place.walkerCharacteristics?.length) {
    return place.walkerCharacteristics.map((key) => ({
      label:
        walkerCharacteristicLabels[
          key as keyof typeof walkerCharacteristicLabels
        ] ?? key,
      icon:
        walkerCharacteristicIcons[
          key as keyof typeof walkerCharacteristicIcons
        ] ?? fallbackFactIcons.characteristic,
    }));
  }

  // The steward hasn't confirmed anything yet -- category defaults keep
  // this section from reading empty rather than claiming it's factual.
  return dedupeFacts([...categoryFacts[place.category]]).slice(0, 6);
}

export function getPlaceFacilities(place: Place): WalkerFact[] {
  if (place.facilities.length === 0) {
    return [
      { label: "Information not confirmed yet", icon: Info },
      { label: "Check locally before relying on facilities", icon: Compass },
    ];
  }

  return place.facilities.map((key) => ({
    label: facilityLabels[key as keyof typeof facilityLabels] ?? key,
    icon:
      facilityIcons[key as keyof typeof facilityIcons] ??
      fallbackFactIcons.facility,
  }));
}

function dedupeFacts(facts: WalkerFact[]): WalkerFact[] {
  const seen = new Set<string>();
  return facts.filter((fact) => {
    if (seen.has(fact.label)) return false;
    seen.add(fact.label);
    return true;
  });
}
