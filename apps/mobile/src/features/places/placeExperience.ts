import type { Place, PlaceCategory } from "@waypoint/types";
import {
  facilityGlyphs,
  facilityLabels,
  walkerCharacteristicGlyphs,
  walkerCharacteristicLabels,
} from "@waypoint/ui";

type WalkerFact = {
  label: string;
  icon: string;
};

const categoryFacts: Record<PlaceCategory, WalkerFact[]> = {
  cafe: [
    { label: "Boots welcome", icon: "🥾" },
    { label: "Water refill", icon: "💧" },
    { label: "Good rest stop", icon: "☕" },
  ],
  pub: [
    { label: "Boots welcome", icon: "🥾" },
    { label: "Dogs often welcome", icon: "🐕" },
    { label: "Food after a walk", icon: "🍽" },
  ],
  farm_shop: [
    { label: "Local supplies", icon: "🧺" },
    { label: "Good picnic stop", icon: "🥪" },
  ],
  campsite: [
    { label: "Overnight stop", icon: "⛺" },
    { label: "Water nearby", icon: "💧" },
  ],
  outdoor_shop: [
    { label: "Kit and repairs", icon: "🎒" },
    { label: "Weather advice", icon: "🌦" },
  ],
  attraction: [
    { label: "Worth lingering", icon: "🏛" },
    { label: "Good memory stop", icon: "📖" },
  ],
  other: [{ label: "Useful waypoint", icon: "📍" }],
};

export function getWalkerFacts(place: Place): WalkerFact[] {
  if (place.walkerCharacteristics?.length) {
    return place.walkerCharacteristics.map((key) => ({
      label: walkerCharacteristicLabels[key as keyof typeof walkerCharacteristicLabels] ?? key,
      icon: walkerCharacteristicGlyphs[key as keyof typeof walkerCharacteristicGlyphs] ?? "🥾",
    }));
  }

  // The steward hasn't confirmed anything yet -- category defaults keep
  // this section from reading empty rather than claiming it's factual.
  return dedupeFacts([...categoryFacts[place.category]]).slice(0, 6);
}

export function getPlaceFacilities(place: Place): WalkerFact[] {
  if (place.facilities.length === 0) {
    return [
      { label: "Information not confirmed yet", icon: "ℹ️" },
      { label: "Check locally before relying on facilities", icon: "🧭" },
    ];
  }

  return place.facilities.map((key) => ({
    label: facilityLabels[key as keyof typeof facilityLabels] ?? key,
    icon: facilityGlyphs[key as keyof typeof facilityGlyphs] ?? "✓",
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
