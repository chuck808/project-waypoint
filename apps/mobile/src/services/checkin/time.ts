/**
 * The "calendar day" for a check-in belongs to the venue, not the device.
 * Every Waypoint venue is currently in the UK, so the day boundary is
 * midnight Europe/London. When venues exist in other timezones, the zone
 * moves onto business_locations and this function takes it as a parameter.
 */
const VENUE_TIME_ZONE = "Europe/London";

export function startOfVenueDayISO(now: Date = new Date()): string {
  // Today's date as seen at the venue (en-CA formats as YYYY-MM-DD).
  const venueDay = new Intl.DateTimeFormat("en-CA", {
    timeZone: VENUE_TIME_ZONE,
  }).format(now);

  // First guess: venue midnight is UTC midnight (true under GMT).
  const guess = new Date(`${venueDay}T00:00:00Z`);

  // If the venue clock reads 01:00 at our guess (BST), midnight was earlier.
  const venueHourAtGuess = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: VENUE_TIME_ZONE,
      hour: "2-digit",
      hour12: false,
    }).format(guess),
  );

  return new Date(
    guess.getTime() - venueHourAtGuess * 60 * 60 * 1000,
  ).toISOString();
}
