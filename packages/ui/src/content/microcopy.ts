export const waypointMicrocopy = {
  loading: {
    nearby: "Finding nearby walks…",
    passport: "Opening your Passport…",
    fieldNotes: "Checking recent conditions…",
    places: "Looking for places worth stopping at…",
    trails: "Reading the route ahead…",
  },
  success: {
    checkIn: "You're here. Enjoy the walk.",
    fieldNote: "Shared. The next walker may thank you for that.",
    memorySaved: "Saved to your Passport.",
    stewardNotice: "Published for walkers.",
    qrPoster: "Poster ready for the window.",
  },
  empty: {
    passportTitle: "Your Passport is waiting for its first stamp.",
    passportBody: "Check in at a Waypoint place and your walks will begin to collect here.",
    fieldNotesTitle: "No recent observations yet.",
    fieldNotesBody: "If you notice something useful, leave a Field Note for the next walker.",
    nearbyTitle: "Nothing nearby yet.",
    nearbyBody: "Waypoint grows as walkers and stewards add places worth remembering.",
    stewardNotesTitle: "No official notices.",
    stewardNotesBody: "Use notices for temporary closures, seasonal changes, events or access updates.",
  },
  offline: {
    title: "You're offline. Your walk isn't.",
    body: "We'll keep what we can on this device and sync when the signal returns.",
  },
} as const;

export type WaypointMicrocopy = typeof waypointMicrocopy;
