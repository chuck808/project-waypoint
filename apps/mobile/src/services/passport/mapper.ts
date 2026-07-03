import type { Database } from "@waypoint/database";
import type { PassportStamp } from "@waypoint/types";

type EarnedStampRow = Database["public"]["Tables"]["earned_stamps"]["Row"] & {
  stamp_definitions?:
    Database["public"]["Tables"]["stamp_definitions"]["Row"] | null;
};

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function mapPassportStamp(row: EarnedStampRow): PassportStamp {
  return {
    id: row.id,
    title: row.stamp_definitions?.title ?? "Remembered moment",
    date: formatDate(row.earned_at),
    source: row.source_type,
    description:
      row.stamp_definitions?.description ??
      "A moment added to your Waypoint journey.",
  };
}
