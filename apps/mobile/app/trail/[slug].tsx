import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import {
  AppText,
  PlaceCard,
  PrimaryButton,
  PrimaryLink,
  Screen,
} from "../../src/components";
import type { Place, Trail } from "@waypoint/types";
import { RecentFieldNotes } from "../../src/features/field_notes";
import type { FieldNote } from "../../src/services/field_notes";
import { getFieldNotesForTrail } from "../../src/services/field_notes";
import { getPlaces } from "../../src/services/places";
import { getTrail } from "../../src/services/trails";
import { theme } from "../../src/theme";
import { confirmSwitchWalk, useActiveWalk } from "../../src/features/walks";

export default function TrailDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const [trail, setTrail] = useState<Trail | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [fieldNotes, setFieldNotes] = useState<FieldNote[]>([]);
  const [fieldNotesLoading, setFieldNotesLoading] = useState(false);
  const [fieldNotesError, setFieldNotesError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { activeWalk, start, finish } = useActiveWalk();

  useEffect(() => {
    async function load() {
      if (!slug) return;

      const result = await getTrail(slug);
      setTrail(result);

      const nextPlaces = await getPlaces();

      setPlaces(nextPlaces);
      setLoading(false);

      if (result) {
        setFieldNotesLoading(true);
        setFieldNotesError(null);

        try {
          setFieldNotes(await getFieldNotesForTrail(result.id));
        } catch (err) {
          setFieldNotesError(
            err instanceof Error ? err.message : "Could not load recent notes.",
          );
        } finally {
          setFieldNotesLoading(false);
        }
      }
    }

    load();
  }, [slug]);

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

  const isActiveTrail = activeWalk?.trailId === trail.id;

  function handleStart() {
    if (!trail) return;

    // Switching is explicit, never silent: starting a new walk replaces
    // the current one, so the walker confirms it before it happens.
    if (activeWalk && !isActiveTrail) {
      confirmSwitchWalk(activeWalk.trailName, trail.name, () =>
        start(trail.id, trail.name),
      );
      return;
    }

    start(trail.id, trail.name);
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
        {isActiveTrail ? (
          <PrimaryButton onPress={finish}>Finish walk</PrimaryButton>
        ) : (
          <PrimaryButton onPress={handleStart}>Start this walk</PrimaryButton>
        )}
      </View>

      <View style={styles.section}>
        <AppText variant="label">About this walk</AppText>
        <AppText muted>{trail.description}</AppText>
      </View>

      <View style={styles.section}>
        <AppText variant="label">Recent Field Notes</AppText>
        <RecentFieldNotes
          notes={fieldNotes}
          loading={fieldNotesLoading}
          error={fieldNotesError}
          emptyText="No recent notes for this walk yet. Add one after check-in if something would help the next walker."
        />
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
