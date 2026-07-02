import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AppText, PrimaryLink, Screen } from "../../src/components";
import { places } from "../../src/data/places";
import { theme } from "../../src/theme";

export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams();
  const place = places.find((item) => item.id === id) ?? places[0];

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

      <PrimaryLink href="/scan">Record visit</PrimaryLink>
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
