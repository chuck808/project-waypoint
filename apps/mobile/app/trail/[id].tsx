import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AppText, PlaceCard, PrimaryLink, Screen } from "../../src/components";
import { places } from "../../src/data/places";
import { theme } from "../../src/theme";
import type { Trail } from "@waypoint/types";
import { getTrail } from "../../src/services/trails";

export default function TrailDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [trail, setTrail] = useState<Trail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;

      const result = await getTrail(id);

      setTrail(result);
      setLoading(false);
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <Screen>
        <AppText>Loading trail...</AppText>
      </Screen>
    );
  }

  if (!trail) {
    return (
      <Screen>
        <AppText>Trail not found.</AppText>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="label" muted>
          {trail.region}
        </AppText>

        <AppText variant="title">{trail.name}</AppText>

        <AppText muted>
          {trail.distance} · {trail.difficulty} · {trail.duration}
        </AppText>
      </View>

      <View style={styles.section}>
        <AppText variant="label">About this walk</AppText>
        <AppText muted>{trail.description}</AppText>
      </View>

      <View style={styles.section}>
        <AppText variant="label">Along the way</AppText>

        {places.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </View>

      <PrimaryLink href="/discover">Back to discover</PrimaryLink>
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
    marginBottom: theme.spacing.xl,
  },
  place: {
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
});
