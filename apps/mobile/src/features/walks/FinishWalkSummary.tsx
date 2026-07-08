import { StyleSheet, View } from "react-native";
import { AppText, Card, PrimaryButton, PrimaryLink } from "../../components";
import type { ActiveWalk, WalkJournalEntry } from "../../services/walks";
import { theme } from "../../theme";

type FinishWalkSummaryProps = {
  activeWalk: ActiveWalk;
  entries: WalkJournalEntry[];
  onFinish: () => void;
};

function formatStartedAt(value: string) {
  return new Date(value).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function FinishWalkSummary({
  activeWalk,
  entries,
  onFinish,
}: FinishWalkSummaryProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText variant="label" muted>
          Finish walk
        </AppText>
        <AppText variant="title">Remember this walk.</AppText>
        <AppText muted>
          You started {activeWalk.trailName} at {formatStartedAt(activeWalk.startedAt)}.
        </AppText>
      </View>

      <Card style={styles.card}>
        <AppText variant="heading">Today's trail</AppText>
        <AppText muted>
          {entries.length > 0
            ? `You checked in at ${entries.length} ${entries.length === 1 ? "place" : "places"} along the way.`
            : "No check-ins were recorded on this walk. That's fine — not every good walk needs a stamp."}
        </AppText>
      </Card>

      {entries.length > 0 ? (
        <View style={styles.timeline}>
          {entries.map((entry) => (
            <Card key={entry.checkInId} style={styles.entry}>
              <AppText variant="label" muted>
                {new Date(entry.visitedAt).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </AppText>
              <AppText variant="heading">{entry.placeName}</AppText>
              <AppText muted>{entry.businessName}</AppText>
            </Card>
          ))}
        </View>
      ) : null}

      <Card style={styles.prompt}>
        <AppText variant="heading">Before you go</AppText>
        <AppText muted>
          If something would help the next walker — mud, access, water, welcome — leave it as a Field Note from the place or trail screen.
        </AppText>
      </Card>

      <PrimaryButton onPress={onFinish}>Finish and save walk</PrimaryButton>
      <PrimaryLink href="/passport">View Passport</PrimaryLink>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.lg,
  },
  header: {
    gap: theme.spacing.sm,
  },
  card: {
    gap: theme.spacing.sm,
  },
  timeline: {
    gap: theme.spacing.md,
  },
  entry: {
    gap: theme.spacing.xs,
  },
  prompt: {
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primarySoft,
  },
});
