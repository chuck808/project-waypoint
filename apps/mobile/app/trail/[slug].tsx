import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  AppText,
  Card,
  DetailSection,
  InfoChip,
  KeyValueRow,
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
import { getTrailAdvice, getTrailFacts } from "../../src/features/trails/trailExperience";
import { OfficialNotes } from "../../src/features/steward/OfficialNotes";
import { theme } from "../../src/theme";
import { confirmSwitchWalk, useActiveWalk } from "../../src/features/walks";

export default function TrailDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const [trail, setTrail] = useState<Trail | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [fieldNotes, setFieldNotes] = useState<FieldNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const { activeWalk, start, finish } = useActiveWalk();

  useEffect(() => {
    async function load() {
      if (!slug) return;

      try {
        const result = await getTrail(slug);
        setTrail(result);

        const [nextPlaces, nextNotes] = await Promise.all([
          getPlaces(),
          result ? getFieldNotesForTrail(result.id).catch(() => []) : [],
        ]);

        setPlaces(nextPlaces);
        setFieldNotes(nextNotes);
      } catch (err) {
        // PGRST116 ("no rows") from a bad/stale slug is not an error --
        // it's handled by the !trail "not found" branch below. Anything
        // else (network, RLS, etc.) gets its own message.
        const code = (err as { code?: string } | null)?.code;
        if (code !== "PGRST116") {
          setLoadError(
            err instanceof Error ? err.message : "Unable to load this walk.",
          );
        }
      } finally {
        setLoading(false);
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

  if (loadError) {
    return (
      <Screen>
        <AppText variant="title">Something went wrong.</AppText>
        <AppText muted>{loadError}</AppText>
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
  const trailFacts = getTrailFacts(trail);

  function handleStart() {
    if (!trail) return;

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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <AppText style={styles.heroGlyph}>⛰</AppText>
          <View style={styles.heroContent}>
            <AppText variant="label" muted>
              {trail.region}
            </AppText>
            <AppText variant="title">{trail.name}</AppText>
            <AppText muted>{trail.distance} · {trail.difficulty} · {trail.duration}</AppText>
          </View>
        </View>

        <View style={styles.section}>
          {isActiveTrail ? (
            <PrimaryButton onPress={finish}>Finish walk</PrimaryButton>
          ) : (
            <PrimaryButton onPress={handleStart}>Start this walk</PrimaryButton>
          )}
        </View>

        <DetailSection title="About this walk" eyebrow="What to expect">
          <Card>
            <AppText muted>{trail.description}</AppText>
            <View style={styles.chipGrid}>
              <InfoChip label={trail.type.replace("_", " ")} icon="🧭" tone="accent" />
              <InfoChip label={trail.difficulty} icon="🥾" tone="success" />
              <InfoChip label={trail.duration} icon="⏱" />
            </View>
          </Card>
        </DetailSection>

        <DetailSection title="Walk facts">
          <Card>
            {trailFacts.map((fact) => (
              <KeyValueRow key={fact.label} label={fact.label} value={fact.value} />
            ))}
          </Card>
        </DetailSection>

        <DetailSection title="Recent conditions" eyebrow="Shared by walkers">
          <RecentFieldNotes
            notes={fieldNotes}
            emptyText="No recent observations for this walk yet. If you notice something useful, leave a Field Note after check-in."
          />
        </DetailSection>

        <DetailSection title="Official updates" eyebrow="Access and stewardship">
          <OfficialNotes />
        </DetailSection>

        <DetailSection title="Before you set off">
          <Card>
            <AppText muted>{getTrailAdvice(trail)}</AppText>
          </Card>
        </DetailSection>

        <DetailSection title="Useful places along the way">
          {places.length === 0 ? (
            <Card>
              <AppText muted>Useful places will appear here as the local walking network grows.</AppText>
            </Card>
          ) : (
            places.map((place) => <PlaceCard key={place.id} place={place} />)
          )}
        </DetailSection>

        <View style={styles.actions}>
          <PrimaryLink href="/discover">Back to discover</PrimaryLink>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    minHeight: 220,
    borderRadius: theme.radius.frame,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.primarySoft,
    justifyContent: "flex-end",
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.lg,
    overflow: "hidden",
  },
  heroGlyph: {
    position: "absolute",
    right: theme.spacing.lg,
    top: theme.spacing.lg,
    fontSize: 64,
    opacity: 0.35,
  },
  heroContent: {
    gap: theme.spacing.sm,
  },
  section: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  actions: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
});
