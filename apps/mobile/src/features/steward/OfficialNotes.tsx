import { StyleSheet, View } from "react-native";
import { AppText, Card } from "../../components";
import { theme } from "../../theme";

type OfficialNotesProps = {
  stewardNotice?: string;
  seasonalInformation?: string;
};

export function OfficialNotes({
  stewardNotice,
  seasonalInformation,
}: OfficialNotesProps) {
  const hasContent = Boolean(stewardNotice || seasonalInformation);

  return (
    <Card style={styles.card}>
      <View style={styles.badge}>
        <AppText variant="label" style={styles.badgeText}>
          Official
        </AppText>
      </View>

      {hasContent ? (
        <>
          {stewardNotice ? (
            <AppText variant="heading">{stewardNotice}</AppText>
          ) : null}
          {seasonalInformation ? (
            <AppText muted>{seasonalInformation}</AppText>
          ) : null}
        </>
      ) : (
        <>
          <AppText variant="heading">No official updates today</AppText>
          <AppText muted>
            When a steward publishes current access, opening or welcome
            information, it will appear here.
          </AppText>
        </>
      )}
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
