/**
 * Display-only formatting. The venue's calendar day governs *whether* a
 * visit counts (services/checkin/time.ts); the walker's device governs
 * how the moment is described back to them.
 */
export function formatVisitTime(iso: string, now: Date = new Date()): string {
  const visited = new Date(iso);

  const time = visited.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  const sameDay =
    visited.getFullYear() === now.getFullYear() &&
    visited.getMonth() === now.getMonth() &&
    visited.getDate() === now.getDate();

  if (sameDay) return `Today at ${time}`;

  const day = visited.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
  });

  return `${day} at ${time}`;
}
