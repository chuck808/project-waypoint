import { StyleSheet, View } from "react-native";
import { AppText, Card } from "../../components";
import { theme } from "../../theme";

type OfficialNotesProps = {
  title?: string;
  message?: string;
};

export function OfficialNotes({
  title = "No official updates today",
  message = "When a steward publishes current access, opening or welcome information, it will appear here.",
}: OfficialNotesProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.badge}>
        <AppText variant="label" style={styles.badgeText}>
          Official
        </AppText>
      </View>
      <AppText variant="heading">{title}</AppText>
      <AppText muted>{message}</AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderColor: theme.colors.primarySoft,
    backgroundColor: theme.colors.surface,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primarySoft,
  },
  badgeText: {
    color: theme.colors.primary,
  },
});
