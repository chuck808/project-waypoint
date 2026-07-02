import type { Place } from "@waypoint/types";

export const places: Place[] = [
  {
    id: "old-barn-cafe",
    name: "The Old Barn Café",
    category: "cafe",
    displayCategory: "Café",
    description:
      "A quiet walker-friendly café close to the trail, serving coffee, cakes and simple lunches.",
    note: "Walker-friendly stop near the trail.",
    distance: "0.4 km from trail",
    facilities: ["Toilets", "Water refill", "Dog friendly"],
    welcome: "Muddy boots welcome",
    openingHours: "08:00–18:00",
  },
  {
    id: "edale-water",
    name: "Edale Water Refill",
    category: "water",
    displayCategory: "Water",
    description:
      "A useful refill point before the climb. Availability may vary seasonally.",
    note: "Useful refill point before the climb.",
    distance: "0.8 km from trail",
    facilities: ["Water refill"],
    welcome: "Community contributed",
    openingHours: "Always available",
  },
];
