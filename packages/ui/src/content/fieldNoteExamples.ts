// Mirrors the canonical FieldNoteCategory union (apps/mobile/src/services/field_notes/types.ts)
// and the database's field_notes_category_check constraint. Keep in sync with both —
// an invalid category here either violates the DB constraint or silently collapses to
// "other" through the mobile app's category-normalising guard.
type FieldNoteExampleCategory =
  | "mud_bog"
  | "bridge_stile_gate"
  | "fallen_tree"
  | "livestock"
  | "water"
  | "weather"
  | "access"
  | "facilities"
  | "welcome"
  | "viewpoint"
  | "other";

type FieldNoteExample = {
  category: FieldNoteExampleCategory;
  label: string;
  severity: "info" | "watch" | "hazard";
  message: string;
  context: string;
};

export const fieldNoteExamples = [
  {
    "category": "mud_bog",
    "label": "Muddy / boggy",
    "severity": "watch",
    "message": "Very boggy near the gate. Boots essential.",
    "context": "day_walk"
  },
  {
    "category": "bridge_stile_gate",
    "label": "Bridge / stile / gate",
    "severity": "info",
    "message": "The bridge is slippery after rain.",
    "context": "long_distance"
  },
  {
    "category": "fallen_tree",
    "label": "Fallen tree",
    "severity": "info",
    "message": "Tree partly blocking the path.",
    "context": "family"
  },
  {
    "category": "livestock",
    "label": "Livestock",
    "severity": "watch",
    "message": "Cattle in the upper field today.",
    "context": "dog_walk"
  },
  {
    "category": "water",
    "label": "Water",
    "severity": "info",
    "message": "Water refill point available.",
    "context": "accessible"
  },
  {
    "category": "weather",
    "label": "Weather",
    "severity": "watch",
    "message": "Low cloud on the ridge this morning.",
    "context": "day_walk"
  },
  {
    "category": "access",
    "label": "Access",
    "severity": "hazard",
    "message": "Temporary diversion signed from the lane.",
    "context": "long_distance"
  },
  {
    "category": "facilities",
    "label": "Facilities",
    "severity": "info",
    "message": "Toilets open and clean.",
    "context": "family"
  },
  {
    "category": "welcome",
    "label": "Welcome",
    "severity": "info",
    "message": "Muddy boots welcome inside.",
    "context": "dog_walk"
  },
  {
    "category": "viewpoint",
    "label": "Viewpoint",
    "severity": "info",
    "message": "Wonderful view after the rain cleared.",
    "context": "accessible"
  },
  {
    "category": "other",
    "label": "Other",
    "severity": "info",
    "message": "Deer seen near the woodland edge.",
    "context": "day_walk"
  },
  {
    "category": "access",
    "label": "Access",
    "severity": "watch",
    "message": "Car park almost full by 10am.",
    "context": "long_distance"
  },
  {
    "category": "mud_bog",
    "label": "Muddy / boggy",
    "severity": "watch",
    "message": "Very boggy near the gate. Boots essential.",
    "context": "family"
  },
  {
    "category": "bridge_stile_gate",
    "label": "Bridge / stile / gate",
    "severity": "info",
    "message": "The bridge is slippery after rain.",
    "context": "dog_walk"
  },
  {
    "category": "fallen_tree",
    "label": "Fallen tree",
    "severity": "info",
    "message": "Tree partly blocking the path.",
    "context": "accessible"
  },
  {
    "category": "livestock",
    "label": "Livestock",
    "severity": "watch",
    "message": "Cattle in the upper field today.",
    "context": "day_walk"
  },
  {
    "category": "water",
    "label": "Water",
    "severity": "info",
    "message": "Water refill point available.",
    "context": "long_distance"
  },
  {
    "category": "weather",
    "label": "Weather",
    "severity": "watch",
    "message": "Low cloud on the ridge this morning.",
    "context": "family"
  },
  {
    "category": "access",
    "label": "Access",
    "severity": "hazard",
    "message": "Temporary diversion signed from the lane.",
    "context": "dog_walk"
  },
  {
    "category": "facilities",
    "label": "Facilities",
    "severity": "info",
    "message": "Toilets open and clean.",
    "context": "accessible"
  },
  {
    "category": "welcome",
    "label": "Welcome",
    "severity": "info",
    "message": "Muddy boots welcome inside.",
    "context": "day_walk"
  },
  {
    "category": "viewpoint",
    "label": "Viewpoint",
    "severity": "info",
    "message": "Wonderful view after the rain cleared.",
    "context": "long_distance"
  },
  {
    "category": "other",
    "label": "Other",
    "severity": "info",
    "message": "Deer seen near the woodland edge.",
    "context": "family"
  },
  {
    "category": "access",
    "label": "Access",
    "severity": "watch",
    "message": "Car park almost full by 10am.",
    "context": "dog_walk"
  },
  {
    "category": "mud_bog",
    "label": "Muddy / boggy",
    "severity": "watch",
    "message": "Very boggy near the gate. Boots essential. #25",
    "context": "accessible"
  },
  {
    "category": "bridge_stile_gate",
    "label": "Bridge / stile / gate",
    "severity": "info",
    "message": "The bridge is slippery after rain. #26",
    "context": "day_walk"
  },
  {
    "category": "fallen_tree",
    "label": "Fallen tree",
    "severity": "info",
    "message": "Tree partly blocking the path. #27",
    "context": "long_distance"
  },
  {
    "category": "livestock",
    "label": "Livestock",
    "severity": "watch",
    "message": "Cattle in the upper field today. #28",
    "context": "family"
  },
  {
    "category": "water",
    "label": "Water",
    "severity": "info",
    "message": "Water refill point available. #29",
    "context": "dog_walk"
  },
  {
    "category": "weather",
    "label": "Weather",
    "severity": "watch",
    "message": "Low cloud on the ridge this morning. #30",
    "context": "accessible"
  },
  {
    "category": "access",
    "label": "Access",
    "severity": "hazard",
    "message": "Temporary diversion signed from the lane. #31",
    "context": "day_walk"
  },
  {
    "category": "facilities",
    "label": "Facilities",
    "severity": "info",
    "message": "Toilets open and clean. #32",
    "context": "long_distance"
  },
  {
    "category": "welcome",
    "label": "Welcome",
    "severity": "info",
    "message": "Muddy boots welcome inside. #33",
    "context": "family"
  },
  {
    "category": "viewpoint",
    "label": "Viewpoint",
    "severity": "info",
    "message": "Wonderful view after the rain cleared. #34",
    "context": "dog_walk"
  },
  {
    "category": "other",
    "label": "Other",
    "severity": "info",
    "message": "Deer seen near the woodland edge. #35",
    "context": "accessible"
  },
  {
    "category": "access",
    "label": "Access",
    "severity": "watch",
    "message": "Car park almost full by 10am. #36",
    "context": "day_walk"
  },
  {
    "category": "mud_bog",
    "label": "Muddy / boggy",
    "severity": "watch",
    "message": "Very boggy near the gate. Boots essential. #37",
    "context": "long_distance"
  },
  {
    "category": "bridge_stile_gate",
    "label": "Bridge / stile / gate",
    "severity": "info",
    "message": "The bridge is slippery after rain. #38",
    "context": "family"
  },
  {
    "category": "fallen_tree",
    "label": "Fallen tree",
    "severity": "info",
    "message": "Tree partly blocking the path. #39",
    "context": "dog_walk"
  },
  {
    "category": "livestock",
    "label": "Livestock",
    "severity": "watch",
    "message": "Cattle in the upper field today. #40",
    "context": "accessible"
  },
  {
    "category": "water",
    "label": "Water",
    "severity": "info",
    "message": "Water refill point available. #41",
    "context": "day_walk"
  },
  {
    "category": "weather",
    "label": "Weather",
    "severity": "watch",
    "message": "Low cloud on the ridge this morning. #42",
    "context": "long_distance"
  },
  {
    "category": "access",
    "label": "Access",
    "severity": "hazard",
    "message": "Temporary diversion signed from the lane. #43",
    "context": "family"
  },
  {
    "category": "facilities",
    "label": "Facilities",
    "severity": "info",
    "message": "Toilets open and clean. #44",
    "context": "dog_walk"
  },
  {
    "category": "welcome",
    "label": "Welcome",
    "severity": "info",
    "message": "Muddy boots welcome inside. #45",
    "context": "accessible"
  },
  {
    "category": "viewpoint",
    "label": "Viewpoint",
    "severity": "info",
    "message": "Wonderful view after the rain cleared. #46",
    "context": "day_walk"
  },
  {
    "category": "other",
    "label": "Other",
    "severity": "info",
    "message": "Deer seen near the woodland edge. #47",
    "context": "long_distance"
  },
  {
    "category": "access",
    "label": "Access",
    "severity": "watch",
    "message": "Car park almost full by 10am. #48",
    "context": "family"
  },
  {
    "category": "mud_bog",
    "label": "Muddy / boggy",
    "severity": "watch",
    "message": "Very boggy near the gate. Boots essential. #49",
    "context": "dog_walk"
  },
  {
    "category": "bridge_stile_gate",
    "label": "Bridge / stile / gate",
    "severity": "info",
    "message": "The bridge is slippery after rain. #50",
    "context": "accessible"
  },
  {
    "category": "fallen_tree",
    "label": "Fallen tree",
    "severity": "info",
    "message": "Tree partly blocking the path. #51",
    "context": "day_walk"
  },
  {
    "category": "livestock",
    "label": "Livestock",
    "severity": "watch",
    "message": "Cattle in the upper field today. #52",
    "context": "long_distance"
  },
  {
    "category": "water",
    "label": "Water",
    "severity": "info",
    "message": "Water refill point available. #53",
    "context": "family"
  },
  {
    "category": "weather",
    "label": "Weather",
    "severity": "watch",
    "message": "Low cloud on the ridge this morning. #54",
    "context": "dog_walk"
  },
  {
    "category": "access",
    "label": "Access",
    "severity": "hazard",
    "message": "Temporary diversion signed from the lane. #55",
    "context": "accessible"
  },
  {
    "category": "facilities",
    "label": "Facilities",
    "severity": "info",
    "message": "Toilets open and clean. #56",
    "context": "day_walk"
  },
  {
    "category": "welcome",
    "label": "Welcome",
    "severity": "info",
    "message": "Muddy boots welcome inside. #57",
    "context": "long_distance"
  },
  {
    "category": "viewpoint",
    "label": "Viewpoint",
    "severity": "info",
    "message": "Wonderful view after the rain cleared. #58",
    "context": "family"
  },
  {
    "category": "other",
    "label": "Other",
    "severity": "info",
    "message": "Deer seen near the woodland edge. #59",
    "context": "dog_walk"
  },
  {
    "category": "access",
    "label": "Access",
    "severity": "watch",
    "message": "Car park almost full by 10am. #60",
    "context": "accessible"
  },
  {
    "category": "mud_bog",
    "label": "Muddy / boggy",
    "severity": "watch",
    "message": "Very boggy near the gate. Boots essential. #61",
    "context": "day_walk"
  },
  {
    "category": "bridge_stile_gate",
    "label": "Bridge / stile / gate",
    "severity": "info",
    "message": "The bridge is slippery after rain. #62",
    "context": "long_distance"
  },
  {
    "category": "fallen_tree",
    "label": "Fallen tree",
    "severity": "info",
    "message": "Tree partly blocking the path. #63",
    "context": "family"
  },
  {
    "category": "livestock",
    "label": "Livestock",
    "severity": "watch",
    "message": "Cattle in the upper field today. #64",
    "context": "dog_walk"
  },
  {
    "category": "water",
    "label": "Water",
    "severity": "info",
    "message": "Water refill point available. #65",
    "context": "accessible"
  },
  {
    "category": "weather",
    "label": "Weather",
    "severity": "watch",
    "message": "Low cloud on the ridge this morning. #66",
    "context": "day_walk"
  },
  {
    "category": "access",
    "label": "Access",
    "severity": "hazard",
    "message": "Temporary diversion signed from the lane. #67",
    "context": "long_distance"
  },
  {
    "category": "facilities",
    "label": "Facilities",
    "severity": "info",
    "message": "Toilets open and clean. #68",
    "context": "family"
  },
  {
    "category": "welcome",
    "label": "Welcome",
    "severity": "info",
    "message": "Muddy boots welcome inside. #69",
    "context": "dog_walk"
  },
  {
    "category": "viewpoint",
    "label": "Viewpoint",
    "severity": "info",
    "message": "Wonderful view after the rain cleared. #70",
    "context": "accessible"
  },
  {
    "category": "other",
    "label": "Other",
    "severity": "info",
    "message": "Deer seen near the woodland edge. #71",
    "context": "day_walk"
  },
  {
    "category": "access",
    "label": "Access",
    "severity": "watch",
    "message": "Car park almost full by 10am. #72",
    "context": "long_distance"
  },
  {
    "category": "mud_bog",
    "label": "Muddy / boggy",
    "severity": "watch",
    "message": "Very boggy near the gate. Boots essential. #73",
    "context": "family"
  },
  {
    "category": "bridge_stile_gate",
    "label": "Bridge / stile / gate",
    "severity": "info",
    "message": "The bridge is slippery after rain. #74",
    "context": "dog_walk"
  },
  {
    "category": "fallen_tree",
    "label": "Fallen tree",
    "severity": "info",
    "message": "Tree partly blocking the path. #75",
    "context": "accessible"
  },
  {
    "category": "livestock",
    "label": "Livestock",
    "severity": "watch",
    "message": "Cattle in the upper field today. #76",
    "context": "day_walk"
  },
  {
    "category": "water",
    "label": "Water",
    "severity": "info",
    "message": "Water refill point available. #77",
    "context": "long_distance"
  },
  {
    "category": "weather",
    "label": "Weather",
    "severity": "watch",
    "message": "Low cloud on the ridge this morning. #78",
    "context": "family"
  },
  {
    "category": "access",
    "label": "Access",
    "severity": "hazard",
    "message": "Temporary diversion signed from the lane. #79",
    "context": "dog_walk"
  },
  {
    "category": "facilities",
    "label": "Facilities",
    "severity": "info",
    "message": "Toilets open and clean. #80",
    "context": "accessible"
  },
  {
    "category": "welcome",
    "label": "Welcome",
    "severity": "info",
    "message": "Muddy boots welcome inside. #81",
    "context": "day_walk"
  },
  {
    "category": "viewpoint",
    "label": "Viewpoint",
    "severity": "info",
    "message": "Wonderful view after the rain cleared. #82",
    "context": "long_distance"
  },
  {
    "category": "other",
    "label": "Other",
    "severity": "info",
    "message": "Deer seen near the woodland edge. #83",
    "context": "family"
  },
  {
    "category": "access",
    "label": "Access",
    "severity": "watch",
    "message": "Car park almost full by 10am. #84",
    "context": "dog_walk"
  },
  {
    "category": "mud_bog",
    "label": "Muddy / boggy",
    "severity": "watch",
    "message": "Very boggy near the gate. Boots essential. #85",
    "context": "accessible"
  },
  {
    "category": "bridge_stile_gate",
    "label": "Bridge / stile / gate",
    "severity": "info",
    "message": "The bridge is slippery after rain. #86",
    "context": "day_walk"
  },
  {
    "category": "fallen_tree",
    "label": "Fallen tree",
    "severity": "info",
    "message": "Tree partly blocking the path. #87",
    "context": "long_distance"
  },
  {
    "category": "livestock",
    "label": "Livestock",
    "severity": "watch",
    "message": "Cattle in the upper field today. #88",
    "context": "family"
  },
  {
    "category": "water",
    "label": "Water",
    "severity": "info",
    "message": "Water refill point available. #89",
    "context": "dog_walk"
  },
  {
    "category": "weather",
    "label": "Weather",
    "severity": "watch",
    "message": "Low cloud on the ridge this morning. #90",
    "context": "accessible"
  },
  {
    "category": "access",
    "label": "Access",
    "severity": "hazard",
    "message": "Temporary diversion signed from the lane. #91",
    "context": "day_walk"
  },
  {
    "category": "facilities",
    "label": "Facilities",
    "severity": "info",
    "message": "Toilets open and clean. #92",
    "context": "long_distance"
  },
  {
    "category": "welcome",
    "label": "Welcome",
    "severity": "info",
    "message": "Muddy boots welcome inside. #93",
    "context": "family"
  },
  {
    "category": "viewpoint",
    "label": "Viewpoint",
    "severity": "info",
    "message": "Wonderful view after the rain cleared. #94",
    "context": "dog_walk"
  },
  {
    "category": "other",
    "label": "Other",
    "severity": "info",
    "message": "Deer seen near the woodland edge. #95",
    "context": "accessible"
  },
  {
    "category": "access",
    "label": "Access",
    "severity": "watch",
    "message": "Car park almost full by 10am. #96",
    "context": "day_walk"
  },
  {
    "category": "mud_bog",
    "label": "Muddy / boggy",
    "severity": "watch",
    "message": "Very boggy near the gate. Boots essential. #97",
    "context": "long_distance"
  },
  {
    "category": "bridge_stile_gate",
    "label": "Bridge / stile / gate",
    "severity": "info",
    "message": "The bridge is slippery after rain. #98",
    "context": "family"
  },
  {
    "category": "fallen_tree",
    "label": "Fallen tree",
    "severity": "info",
    "message": "Tree partly blocking the path. #99",
    "context": "dog_walk"
  },
  {
    "category": "livestock",
    "label": "Livestock",
    "severity": "watch",
    "message": "Cattle in the upper field today. #100",
    "context": "accessible"
  },
  {
    "category": "water",
    "label": "Water",
    "severity": "info",
    "message": "Water refill point available. #101",
    "context": "day_walk"
  },
  {
    "category": "weather",
    "label": "Weather",
    "severity": "watch",
    "message": "Low cloud on the ridge this morning. #102",
    "context": "long_distance"
  },
  {
    "category": "access",
    "label": "Access",
    "severity": "hazard",
    "message": "Temporary diversion signed from the lane. #103",
    "context": "family"
  },
  {
    "category": "facilities",
    "label": "Facilities",
    "severity": "info",
    "message": "Toilets open and clean. #104",
    "context": "dog_walk"
  },
  {
    "category": "welcome",
    "label": "Welcome",
    "severity": "info",
    "message": "Muddy boots welcome inside. #105",
    "context": "accessible"
  },
  {
    "category": "viewpoint",
    "label": "Viewpoint",
    "severity": "info",
    "message": "Wonderful view after the rain cleared. #106",
    "context": "day_walk"
  },
  {
    "category": "other",
    "label": "Other",
    "severity": "info",
    "message": "Deer seen near the woodland edge. #107",
    "context": "long_distance"
  },
  {
    "category": "access",
    "label": "Access",
    "severity": "watch",
    "message": "Car park almost full by 10am. #108",
    "context": "family"
  },
  {
    "category": "mud_bog",
    "label": "Muddy / boggy",
    "severity": "watch",
    "message": "Very boggy near the gate. Boots essential. #109",
    "context": "dog_walk"
  },
  {
    "category": "bridge_stile_gate",
    "label": "Bridge / stile / gate",
    "severity": "info",
    "message": "The bridge is slippery after rain. #110",
    "context": "accessible"
  },
  {
    "category": "fallen_tree",
    "label": "Fallen tree",
    "severity": "info",
    "message": "Tree partly blocking the path. #111",
    "context": "day_walk"
  },
  {
    "category": "livestock",
    "label": "Livestock",
    "severity": "watch",
    "message": "Cattle in the upper field today. #112",
    "context": "long_distance"
  },
  {
    "category": "water",
    "label": "Water",
    "severity": "info",
    "message": "Water refill point available. #113",
    "context": "family"
  },
  {
    "category": "weather",
    "label": "Weather",
    "severity": "watch",
    "message": "Low cloud on the ridge this morning. #114",
    "context": "dog_walk"
  },
  {
    "category": "access",
    "label": "Access",
    "severity": "hazard",
    "message": "Temporary diversion signed from the lane. #115",
    "context": "accessible"
  },
  {
    "category": "facilities",
    "label": "Facilities",
    "severity": "info",
    "message": "Toilets open and clean. #116",
    "context": "day_walk"
  },
  {
    "category": "welcome",
    "label": "Welcome",
    "severity": "info",
    "message": "Muddy boots welcome inside. #117",
    "context": "long_distance"
  },
  {
    "category": "viewpoint",
    "label": "Viewpoint",
    "severity": "info",
    "message": "Wonderful view after the rain cleared. #118",
    "context": "family"
  },
  {
    "category": "other",
    "label": "Other",
    "severity": "info",
    "message": "Deer seen near the woodland edge. #119",
    "context": "dog_walk"
  },
  {
    "category": "access",
    "label": "Access",
    "severity": "watch",
    "message": "Car park almost full by 10am. #120",
    "context": "accessible"
  }
] as const satisfies FieldNoteExample[];
