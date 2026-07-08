import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import type { Place } from "@waypoint/types";
import { AppText, PrimaryLink, Screen } from "../../src/components";
import { RecentFieldNotes } from "../../src/features/field_notes";
import type { FieldNote } from "../../src/services/field_notes";
import { getFieldNotesForPlace } from "../../src/services/field_notes";
import { getPlace } from "../../src/services/places";
import { theme } from "../../src/theme";

export default function PlaceDetailScreen() {
  const { id: rawId } = useLocalSearchParams();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [place, setPlace] = useState<Place | null>(null);
  const [fieldNotes, setFieldNotes] = useState<FieldNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;

      const [nextPlace, nextNotes] = await Promise.all([
        getPlace(id),
        getFieldNotesForPlace(id).catch(() => []),
      ]);

      setPlace(nextPlace);
      setFieldNotes(nextNotes);
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

      <View style={styles.section}>
        <AppText variant="label">Recent Field Notes</AppText>
        <RecentFieldNotes
          notes={fieldNotes}
          emptyText="No recent notes for this place yet."
        />
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
