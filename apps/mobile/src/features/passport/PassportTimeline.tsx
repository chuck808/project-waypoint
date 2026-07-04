import { StyleSheet, View } from "react-native";
import { AppText } from "../../components";
import { theme } from "../../theme";
import type { PassportMoment } from "../../services/passport";
import { groupByMonth } from "./formatMoment";
import { MomentCard } from "./MomentCard";

type PassportTimelineProps = {
  moments: PassportMoment[];
};

/**
 * The service supplies a flat, newest-first list of moments; the month
 * grouping is this screen's way of telling the story. Other surfaces
 * may group the same moments differently.
 */
export function PassportTimeline({ moments }: PassportTimelineProps) {
  if (moments.length === 0) {
    return (
      <AppText muted>
        No memories yet. Your first check-in will start your story.
      </AppText>
    );
  }

  return (
    <View style={styles.timeline}>
      {groupByMonth(moments).map((group) => (
        <View key={group.month} style={styles.month}>
          <AppText variant="label" muted>
            {group.month}
          </AppText>

          {group.moments.map((moment) => (
            <MomentCard key={moment.id} moment={moment} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  timeline: {
    gap: theme.spacing.lg,
  },
  month: {
    gap: theme.spacing.md,
  },
});
