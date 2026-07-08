export const seasonalContent = {
  spring: {
    label: "Spring",
    fieldNotePrompts: ["Bluebells beginning", "Lambing nearby", "Paths drying out", "Birdsong worth pausing for"],
    stewardPrompts: ["Lambing notice", "Spring opening hours", "Bluebell route advice"],
  },
  summer: {
    label: "Summer",
    fieldNotePrompts: ["Water source dry", "Busy car park", "Shade appreciated", "Evening light excellent"],
    stewardPrompts: ["Extended hours", "Water refill reminder", "Festival notice"],
  },
  autumn: {
    label: "Autumn",
    fieldNotePrompts: ["Leaves slippery", "Misty viewpoint", "Deer activity", "Path muddy after rain"],
    stewardPrompts: ["Autumn menu", "Wet path warning", "Shorter daylight reminder"],
  },
  winter: {
    label: "Winter",
    fieldNotePrompts: ["Ice underfoot", "Low visibility", "Café warm and open", "Bridge slippery"],
    stewardPrompts: ["Winter opening hours", "Storm damage notice", "Path closure"],
  },
} as const;
