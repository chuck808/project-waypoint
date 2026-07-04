/**
 * Display-only formatting for the timeline. Month headers carry the
 * year; entries carry day and time. Device locale, deliberately —
 * presentation belongs to the walker, day-boundary logic to the venue.
 */
export function monthKey(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
}

export function dayAndTime(iso: string): string {
  const visited = new Date(iso);

  const day = visited.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
  });

  const time = visited.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${day} · ${time}`;
}

/** Groups newest-first moments into month sections, order preserved. */
export function groupByMonth<T extends { occurredAt: string }>(
  moments: T[],
): { month: string; moments: T[] }[] {
  const groups: { month: string; moments: T[] }[] = [];

  for (const moment of moments) {
    const month = monthKey(moment.occurredAt);
    const current = groups[groups.length - 1];

    if (current && current.month === month) {
      current.moments.push(moment);
    } else {
      groups.push({ month, moments: [moment] });
    }
  }

  return groups;
}
