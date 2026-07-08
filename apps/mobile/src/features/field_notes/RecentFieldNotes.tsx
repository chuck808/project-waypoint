import { StyleSheet, View } from "react-native";
import { AppText, Card, InfoChip } from "../../components";
import {
  fieldNoteSeverityLabels,
  fieldNoteSourceLabels,
  getFieldNoteCategoryMeta,
  type FieldNote,
  type FieldNoteSeverity,
} from "../../services/field_notes";
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

function severityTone(severity: FieldNoteSeverity): "neutral" | "warning" | "accent" | "error" {
  if (severity === "hazard") return "error";
  if (severity === "watch") return "accent";
  return "neutral";
}

export function RecentFieldNotes({
  notes,
  emptyText = "No recent Field Notes yet.",
}: RecentFieldNotesProps) {
  if (notes.length === 0) {
    return (
      <Card style={styles.empty}>
        <AppText variant="heading">A quiet patch of map.</AppText>
        <AppText muted>{emptyText}</AppText>
      </Card>
    );
  }

  return (
    <View style={styles.list}>
      {notes.map((note) => {
        const meta = getFieldNoteCategoryMeta(note.category);

        return (
          <Card key={note.id} style={styles.note}>
            <View style={styles.header}>
              <View style={styles.titleGroup}>
                <AppText variant="heading">
                  {meta.glyph} {note.categoryLabel}
                </AppText>
                <AppText variant="label" muted>
                  {fieldNoteSourceLabels[note.source]} · {formatObservedAt(note.observedAt)}
                </AppText>
              </View>
            </View>

            <AppText muted>
              {note.message ??
                (note.source === "steward"
                  ? "Official update from a place steward."
                  : "Shared to help the next walker.")}
            </AppText>

            <View style={styles.chips}>
              <InfoChip
                label={fieldNoteSeverityLabels[note.severity]}
                tone={severityTone(note.severity)}
              />
              {note.source !== "explorer" ? <InfoChip label="Verified source" icon="✓" tone="success" /> : null}
            </View>
          </Card>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: theme.spacing.sm,
  },
  note: {
    gap: theme.spacing.sm,
  },
  empty: {
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  titleGroup: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.xs,
  },
});
