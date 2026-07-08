import type { Place, PlaceCategory } from "@waypoint/types";

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
  const facts = [...categoryFacts[place.category]];

  for (const facility of place.facilities) {
    const lower = facility.toLowerCase();
    if (lower.includes("toilet")) facts.push({ label: "Toilets", icon: "🚻" });
    if (lower.includes("dog")) facts.push({ label: "Dog friendly", icon: "🐕" });
    if (lower.includes("water")) facts.push({ label: "Water refill", icon: "💧" });
    if (lower.includes("outdoor")) facts.push({ label: "Outdoor seating", icon: "🌤" });
  }

  return dedupeFacts(facts).slice(0, 6);
}

export function getPlaceFacilities(place: Place): WalkerFact[] {
  if (place.facilities.length === 0) {
    return [
      { label: "Information not confirmed yet", icon: "ℹ️" },
      { label: "Check locally before relying on facilities", icon: "🧭" },
    ];
  }

  return place.facilities.map((facility) => ({ label: facility, icon: "✓" }));
}

function dedupeFacts(facts: WalkerFact[]): WalkerFact[] {
  const seen = new Set<string>();
  return facts.filter((fact) => {
    if (seen.has(fact.label)) return false;
    seen.add(fact.label);
    return true;
  });
}
