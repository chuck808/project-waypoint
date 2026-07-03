import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppText, PassportStamp, PrimaryLink, Screen } from "../src/components";
import type { PassportStamp as PassportStampType } from "@waypoint/types";
import { getPassportStamps } from "../src/services/passport";
import { theme } from "../src/theme";

export default function PassportScreen() {
  const [stamps, setStamps] = useState<PassportStampType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const next = await getPassportStamps();
        setStamps(next);
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
        <AppText variant="heading">{stamps.length}</AppText>
        <AppText muted>memories added so far</AppText>
      </View>

      <View style={styles.list}>
        {loading ? (
          <AppText muted>Loading your Passport…</AppText>
        ) : error ? (
          <AppText muted>{error}</AppText>
        ) : stamps.length === 0 ? (
          <AppText muted>
            Your Passport is waiting for its first memory.
          </AppText>
        ) : (
          stamps.map((stamp) => <PassportStamp key={stamp.id} stamp={stamp} />)
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
    borderRadius: 18,
    backgroundColor: theme.colors.primarySoft,
    marginBottom: theme.spacing.xl,
  },
  list: {
    gap: theme.spacing.md,
  },
});
