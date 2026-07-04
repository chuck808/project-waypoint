import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppText, PrimaryLink, Screen } from "../src/components";
import { PassportTimeline } from "../src/features/passport";
import {
  getPassportMoments,
  type PassportMoment,
} from "../src/services/passport";
import { theme } from "../src/theme";

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

      <View style={styles.summary}>
        <AppText variant="heading">{moments.length}</AppText>
        <AppText muted>memories added so far</AppText>
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

      <PrimaryLink href="/">Back home</PrimaryLink>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  summary: {
    padding: theme.spacing.lg,
    borderRadius: theme.radius.card,
    backgroundColor: theme.colors.primarySoft,
    marginBottom: theme.spacing.xl,
  },
  list: {
    gap: theme.spacing.md,
  },
});
