import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppText, Screen } from "../../src/components";
import { PassportTimeline } from "../../src/features/passport";
import { ActiveWalkBanner } from "../../src/features/walks";
import { countDistinctBy } from "../../src/lib/collections";
import {
  getPassportMoments,
  type PassportMoment,
} from "../../src/services/passport";
import { theme } from "../../src/theme";

export default function PassportScreen() {
  const [moments, setMoments] = useState<PassportMoment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const next = await getPassportMoments();
        setMoments(next);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load passport.",
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="label" muted>
          Passport
        </AppText>

        <AppText variant="title">Your journeys, remembered.</AppText>

        <AppText muted>
          Stamps are not trophies. They are small records of places, trails and
          moments worth keeping.
        </AppText>
      </View>

      <ActiveWalkBanner />

      <View style={styles.stats}>
        <View style={styles.stat}>
          <AppText variant="heading">{moments.length}</AppText>
          <AppText variant="label" muted>
            Moments
          </AppText>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.stat}>
          <AppText variant="heading">
            {countDistinctBy(moments, "trailName")}
          </AppText>
          <AppText variant="label" muted>
            Trails
          </AppText>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.stat}>
          <AppText variant="heading">
            {countDistinctBy(moments, "placeName")}
          </AppText>
          <AppText variant="label" muted>
            Places
          </AppText>
        </View>
      </View>

      <View style={styles.list}>
        {loading ? (
          <AppText muted>Loading your Passport…</AppText>
        ) : error ? (
          <AppText muted>{error}</AppText>
        ) : (
          <PassportTimeline moments={moments} />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.lg,
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.primarySoft,
    marginBottom: theme.spacing.xl,
  },
  stat: {
    flex: 1,
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: theme.colors.border,
  },
  list: {
    gap: theme.spacing.md,
  },
});
