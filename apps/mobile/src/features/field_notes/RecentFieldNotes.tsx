import { StyleSheet, View } from "react-native";
import { AppText, Card } from "../../components";
import {
  fieldNoteSeverityLabels,
  fieldNoteSourceLabels,
  getFieldNoteCategoryMeta,
  type FieldNote,
} from "../../services/field_notes";
import { theme } from "../../theme";

type RecentFieldNotesProps = {
  notes: FieldNote[];
  emptyText?: string;
  loading?: boolean;
  error?: string | null;
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

function severityStyle(severity: FieldNote["severity"]) {
  if (severity === "hazard") return styles.hazardPill;
  if (severity === "watch") return styles.watchPill;
  return styles.infoPill;
}

export function RecentFieldNotes({
  notes,
  emptyText = "No recent Field Notes yet.",
  loading = false,
  error = null,
}: RecentFieldNotesProps) {
  if (loading) {
    return (
      <Card style={styles.stateCard}>
        <AppText muted>Checking recent conditions…</AppText>
      </Card>
    );
  }

  if (error) {
    return (
      <Card style={styles.stateCard}>
        <AppText variant="label">Recent conditions unavailable</AppText>
        <AppText muted>{error}</AppText>
      </Card>
    );
  }

  if (notes.length === 0) {
    return (
      <Card style={styles.stateCard}>
        <AppText variant="label">Nothing recent reported</AppText>
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
            <View style={styles.row}>
              <View style={styles.glyph}>
                <AppText variant="heading">{meta.glyph}</AppText>
              </View>

              <View style={styles.content}>
                <View style={styles.header}>
                  <AppText variant="label">{meta.label}</AppText>
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

                <View style={styles.metaRow}>
                  <View style={[styles.pill, severityStyle(note.severity)]}>
                    <AppText variant="label" style={styles.pillText}>
                      {fieldNoteSeverityLabels[note.severity]}
                    </AppText>
                  </View>

                  <AppText variant="label" muted>
                    {fieldNoteSourceLabels[note.source]}
                  </AppText>
                </View>
              </View>
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
  stateCard: {
    gap: theme.spacing.xs,
  },
  note: {
    gap: theme.spacing.xs,
  },
  row: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  glyph: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    flexWrap: "wrap",
    marginTop: theme.spacing.xs,
  },
  pill: {
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
  },
  infoPill: {
    backgroundColor: theme.colors.primarySoft,
  },
  watchPill: {
    backgroundColor: theme.colors.warningSoft,
  },
  hazardPill: {
    backgroundColor: theme.colors.errorSoft,
  },
  pillText: {
    color: theme.colors.text,
  },
});
