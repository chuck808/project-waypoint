import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import type { Place, Trail } from "@waypoint/types";
import {
  AppText,
  FilterChip,
  FormField,
  PlaceCard,
  Screen,
  TrailCard,
} from "../../src/components";
import { getPlaces } from "../../src/services/places";
import { getTrails } from "../../src/services/trails";
import { theme } from "../../src/theme";
import { ActiveWalkBanner } from "../../src/features/walks";

function matchesQuery(query: string, ...fields: string[]): boolean {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return true;
  return fields.some((field) => field.toLowerCase().includes(trimmed));
}

function distinct<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

export default function DiscoverScreen() {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const nextTrails = await getTrails();
        setTrails(nextTrails);

        const nextPlaces = await getPlaces();
        setPlaces(nextPlaces);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to load trails.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, []);

  // Filter chips only offer values that actually exist in today's
  // catalogue -- no dead options for a category or difficulty with
  // nothing behind it yet.
  const availableDifficulties = useMemo(
    () => distinct(trails.map((trail) => trail.difficulty)),
    [trails],
  );
  const availableCategories = useMemo(
    () => distinct(places.map((place) => place.category)),
    [places],
  );

  const filteredTrails = trails.filter(
    (trail) =>
      (!difficultyFilter || trail.difficulty === difficultyFilter) &&
      matchesQuery(query, trail.name, trail.region),
  );
  const filteredPlaces = places.filter(
    (place) =>
      (!categoryFilter || place.category === categoryFilter) &&
      matchesQuery(query, place.name, place.displayCategory),
  );

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="label" muted>
          Discover
        </AppText>
        <AppText variant="title">Where would you like to walk today?</AppText>
      </View>

      <ActiveWalkBanner />

      <FormField
        value={query}
        onChangeText={setQuery}
        placeholder="Search trails or places"
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.search}
      />

      {availableDifficulties.length > 1 ? (
        <View style={styles.chipRow}>
          {availableDifficulties.map((difficulty) => (
            <FilterChip
              key={difficulty}
              label={difficulty}
              active={difficultyFilter === difficulty}
              onPress={() =>
                setDifficultyFilter((current) =>
                  current === difficulty ? null : difficulty,
                )
              }
            />
          ))}
        </View>
      ) : null}

      {availableCategories.length > 1 ? (
        <View style={styles.chipRow}>
          {availableCategories.map((category) => (
            <FilterChip
              key={category}
              label={category.replace("_", " ")}
              active={categoryFilter === category}
              onPress={() =>
                setCategoryFilter((current) =>
                  current === category ? null : category,
                )
              }
            />
          ))}
        </View>
      ) : null}

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <AppText variant="label" muted>
            Popular nearby
          </AppText>

          {isLoading ? (
            <AppText muted>Loading trails…</AppText>
          ) : errorMessage ? (
            <AppText muted>{errorMessage}</AppText>
          ) : filteredTrails.length === 0 ? (
            <AppText muted>No trails match yet.</AppText>
          ) : (
            filteredTrails.map((trail) => (
              <TrailCard key={trail.id} trail={trail} />
            ))
          )}
        </View>

        <View style={styles.section}>
          <AppText variant="label" muted>
            Nearby places
          </AppText>

          {!isLoading && filteredPlaces.length === 0 ? (
            <AppText muted>No places match yet.</AppText>
          ) : (
            filteredPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  search: {
    marginBottom: theme.spacing.md,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: theme.spacing.sm,
    rowGap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  scroll: {
    flex: 1,
  },
  section: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
});
