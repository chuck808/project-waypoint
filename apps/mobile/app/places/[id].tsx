import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import type { Place } from "@waypoint/types";
import { AppText, PrimaryLink, Screen } from "../../src/components";
import { getPlace } from "../../src/services/places";
import { theme } from "../../src/theme";

export default function PlaceDetailScreen() {
  const { id: rawId } = useLocalSearchParams();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;

      const nextPlace = await getPlace(id);
      setPlace(nextPlace);
      setLoading(false);
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <Screen>
        <AppText>Loading place...</AppText>
      </Screen>
    );
  }

  if (!place) {
    return (
      <Screen>
        <AppText>Place not found.</AppText>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="label" muted>
          {place.category} · {place.distance}
        </AppText>

        <AppText variant="title">{place.name}</AppText>

        <AppText muted>{place.description}</AppText>
      </View>

      <View style={styles.section}>
        <AppText variant="label">Walker welcome</AppText>
        <AppText muted>{place.welcome}</AppText>
      </View>

      <View style={styles.section}>
        <AppText variant="label">Facilities</AppText>

        {place.facilities.map((facility) => (
          <AppText key={facility} muted>
            {facility}
          </AppText>
        ))}
      </View>

      <View style={styles.section}>
        <AppText variant="label">Opening</AppText>
        <AppText muted>{place.openingHours}</AppText>
      </View>

      <View style={styles.mapPlaceholder}>
        <AppText variant="label" muted>
          Map preview
        </AppText>
      </View>

      <PrimaryLink href="/check-in">Record visit</PrimaryLink>
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
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  mapPlaceholder: {
    height: 120,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.lg,
  },
});
