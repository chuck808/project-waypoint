import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AppText, PlaceCard, PrimaryLink, Screen } from "../../src/components";
import { places } from "../../src/data/places";
import { trails } from "../../src/data/trails";
import { theme } from "../../src/theme";

export default function TrailDetailScreen() {
  const { id } = useLocalSearchParams();
  const trail = trails.find((item) => item.id === id) ?? trails[0];

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