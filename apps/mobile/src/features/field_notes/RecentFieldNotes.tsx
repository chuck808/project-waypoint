import { StyleSheet, View } from "react-native";
import { AppText, Card } from "../../components";
import type { FieldNote } from "../../services/field_notes";
import { theme } from "../../theme";

type RecentFieldNotesProps = {
  notes: FieldNote[];
  emptyText?: string;
};

function formatObservedAt(value: string): string {
  const observed = new Date(value);
  const diffMs = Date.now() - observed.getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function RecentFieldNotes({
  notes,
  emptyText = "No recent Field Notes yet.",
}: RecentFieldNotesProps) {
  if (notes.length === 0) {
    return (
      <Card>
        <AppText muted>{emptyText}</AppText>
      </Card>
    );
  }

  return (
    <View style={styles.list}>
      {notes.map((note) => (
        <Card key={note.id} style={styles.note}>
          <View style={styles.header}>
            <AppText variant="label">{note.categoryLabel}</AppText>
            <AppText variant="label" muted>
              {formatObservedAt(note.observedAt)}
            </AppText>
          </View>

          <AppText muted>
            {note.message ??
              (note.source === "steward"
                ? "Official update from a place steward."
                : "Reported by another walker.")}
          </AppText>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: theme.spacing.sm,
  },
  note: {
    gap: theme.spacing.xs,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
});
