import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import type { Place } from "@waypoint/types";
import {
  AppText,
  Card,
  DetailSection,
  InfoChip,
  KeyValueRow,
  PrimaryLink,
  Screen,
} from "../../src/components";
import { RecentFieldNotes } from "../../src/features/field_notes";
import {
  getPlaceFacilities,
  getWalkerFacts,
} from "../../src/features/places/placeExperience";
import { PlaceContentSections } from "../../src/features/places/PlaceContentSections";
import { OfficialNotes } from "../../src/features/steward/OfficialNotes";
import type { FieldNote } from "../../src/services/field_notes";
import { getFieldNotesForPlace } from "../../src/services/field_notes";
import { getPlace } from "../../src/services/places";
import { getCategoryStyle } from "../../src/theme/categoryStyles";
import { theme } from "../../src/theme";
import { TopoContours } from "../../src/components/TopoContours";

export default function PlaceDetailScreen() {
  const { id: rawId } = useLocalSearchParams();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [place, setPlace] = useState<Place | null>(null);
  const [fieldNotes, setFieldNotes] = useState<FieldNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!id) return;

      try {
        const [nextPlace, nextNotes] = await Promise.all([
          getPlace(id),
          getFieldNotesForPlace(id).catch(() => []),
        ]);

        setPlace(nextPlace);
        setFieldNotes(nextNotes);
      } catch (err) {
        // PGRST116 ("no rows") from a bad/stale/deleted id is not an
        // error -- it's handled by the !place "not found" branch below.
        // Anything else (network, RLS, etc.) gets its own message.
        const code = (err as { code?: string } | null)?.code;
        if (code !== "PGRST116") {
          setLoadError(
            err instanceof Error ? err.message : "Unable to load this place.",
          );
        }
      } finally {
        setLoading(false);
      }
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

  if (loadError) {
    return (
      <Screen>
        <AppText variant="title">Something went wrong.</AppText>
        <AppText muted>{loadError}</AppText>
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

  const category = getCategoryStyle(place.category);
  const walkerFacts = getWalkerFacts(place);
  const facilities = getPlaceFacilities(place);

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { backgroundColor: category.bg }]}> 
          <TopoContours color={category.fg} />
          <View style={styles.heroGlyph}>
            <category.icon size={64} color={category.fg} strokeWidth={1.5} />
          </View>
          <View style={styles.heroContent}>
            <AppText variant="label" style={{ color: category.fg }}>
              {place.displayCategory} · {place.distance}
            </AppText>
            <AppText variant="title">{place.name}</AppText>
            <AppText muted>{place.description}</AppText>
          </View>
        </View>

        <PlaceContentSections content={place} />

        <DetailSection title="Walker welcome" eyebrow="Before you arrive">
          <Card>
            {place.welcomeMessage ? (
              <AppText>"{place.welcomeMessage}"</AppText>
            ) : (
              <AppText>{place.welcome}</AppText>
            )}
            <View style={styles.chipGrid}>
              {walkerFacts.map((fact) => (
                <InfoChip
                  key={fact.label}
                  icon={fact.icon}
                  label={fact.label}
                  tone="success"
                />
              ))}
            </View>
          </Card>
        </DetailSection>

        <DetailSection title="Facilities" eyebrow="Useful facts, not reviews">
          <View style={styles.chipGrid}>
            {facilities.map((facility) => (
              <InfoChip
                key={facility.label}
                icon={facility.icon}
                label={facility.label}
              />
            ))}
          </View>
        </DetailSection>

        <DetailSection title="Official updates" eyebrow="From the place steward">
          <OfficialNotes
            stewardNotice={place.stewardNotice}
            seasonalInformation={place.seasonalInformation}
          />
        </DetailSection>

        <DetailSection title="Recent conditions" eyebrow="Shared by walkers">
          <RecentFieldNotes
            notes={fieldNotes}
            emptyText="Nobody has shared observations for this place yet. Be the first to help the next walker."
          />
        </DetailSection>

        <DetailSection title="Planning details">
          <Card>
            <KeyValueRow label="Opening" value={place.openingHours} />
            <KeyValueRow label="Category" value={place.displayCategory} />
            <KeyValueRow label="Distance" value={place.distance} />
          </Card>
        </DetailSection>

        <View style={styles.mapPlaceholder}>
          <AppText variant="label" muted>
            Map preview
          </AppText>
          <AppText muted>Nearby walks and check-in points will appear here.</AppText>
        </View>

        <View style={styles.actions}>
          <PrimaryLink href="/check-in">Record visit</PrimaryLink>
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
    justifyContent: "flex-end",
    overflow: "hidden",
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.lg,
  },
  heroGlyph: {
    position: "absolute",
    right: theme.spacing.lg,
    top: theme.spacing.lg,
    opacity: 0.35,
  },
  heroContent: {
    gap: theme.spacing.sm,
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  mapPlaceholder: {
    minHeight: 140,
    borderRadius: theme.radius.frame,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.mapWash,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
  },
  actions: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
});
