import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import type { Trail } from "@waypoint/types";
import { AppText, PrimaryLink, Screen, TrailCard } from "../src/components";
import { getTrails } from "../src/services/trails";
import { theme } from "../src/theme";

export default function DiscoverScreen() {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadTrails() {
      try {
        const nextTrails = await getTrails();
        setTrails(nextTrails);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to load trails.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadTrails();
  }, []);

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="label" muted>
          Discover
        </AppText>
        <AppText variant="title">Where would you like to walk today?</AppText>
      </View>

      <View style={styles.section}>
        <AppText variant="label" muted>
          Popular nearby
        </AppText>
        <AppText muted>Trail count: {trails.length}</AppText>

        {isLoading ? (
          <AppText muted>Loading trails…</AppText>
        ) : errorMessage ? (
          <AppText muted>{errorMessage}</AppText>
        ) : (
          trails.map((trail) => <TrailCard key={trail.id} trail={trail} />)
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
  section: {
    gap: theme.spacing.md,
  },
});
